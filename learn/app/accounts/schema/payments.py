import base64
import hashlib
import json
from datetime import datetime, timedelta

import environ
import graphene
import razorpay
import requests
import shortuuid
from graphene_django import DjangoObjectType

from app.courses.models import Classes
from ..models import Enrollment, Payments

env = environ.Env()
environ.Env.read_env()

client_rp = razorpay.Client(
    auth=(env("RAZORPAY_KEY"), env("RAZORPAY_SECRET")))


class PaymentsType(DjangoObjectType):
    class Meta:
        model = Payments
        fields = "__all__"


class PhonePeType(graphene.ObjectType):
    success = graphene.Boolean()
    code = graphene.String()
    message = graphene.String()
    data = graphene.JSONString()


class PaymentQuery(graphene.ObjectType):
    # payments
    payments = graphene.List(PaymentsType)
    payment = graphene.Field(PaymentsType, id=graphene.ID(required=True))

    # payments
    def resolve_payments(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Payments.objects.all()

    def resolve_payment(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Payments.objects.get(pk=id)


class PaymentMutation(graphene.ObjectType):
    create_payment_razorpay = graphene.Field(
        PaymentsType, amount=graphene.Int(required=True))
    create_payment_phonepe = graphene.Field(
        PhonePeType, standard=graphene.ID(required=True))

    check_payment_phonepe = graphene.Field(
        PhonePeType, order_id=graphene.String(required=True))

    def resolve_create_payment_razorpay(self, info, amount):
        response = client_rp.order.create({
            "amount": amount * 100,
            "currency": "INR",
        })

        return Payments.objects.create(order_gateway_id=response['id'], gateway='razorpay',
                                       status=response['status'], amount=(response['amount']/100), user=info.context.user,
                                       user_email=info.context.user.email, json_response=response)

    def resolve_create_payment_phonepe(self, info, standard):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        ps_class = Classes.objects.get(id=standard)
        amount = ps_class.latest_price
        api_point = "/pg/v1/pay"
        url = env("PHONEPE_BASE_URL") + api_point

        order_id = "order_" + shortuuid.ShortUUID().random(length=18)


        base_payload = "{\n"
        base_payload += "\t\"merchantId\": \"" + env("PHONEPE_MERCHANT_ID") + "\",\n"
        base_payload += "\t\"merchantTransactionId\": \"" + order_id + "\",\n"
        base_payload += "\t\"merchantUserId\": \"" + str(user.id) + "\",\n"
        base_payload += "\t\"amount\": " + str(amount * 100) + ",\n"
        base_payload += "\t\"redirectUrl\": \"https://prameyshala.com/learn/sub/"+ order_id +"\",\n"
        base_payload += "\t\"redirectMode\": \"REDIRECT\",\n"
        base_payload += "\t\"callbackUrl\": \"http://portal.prameyshala.com/account/payment/phonepe\",\n"
        base_payload += "\t\"mobileNumber\": \"" + user.phone_number + "\",\n"
        base_payload += "\t\"paymentInstrument\": {\n"
        base_payload += "\t\t\"type\": \"PAY_PAGE\"\n"
        base_payload += "\t}\n"
        base_payload += "}"

        base_payload = base64.b64encode(str(base_payload).encode("utf-8"))
        base_payload = base_payload.decode("utf-8")
        hash_string = base_payload + api_point + env("PHONEPE_SECRET")
        hash_sha = hashlib.sha256(hash_string.encode()).hexdigest()

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": hash_sha + "###" + env("PHONEPE_KEY"),
        }

        try:
            response = requests.post(url, headers=headers, json={ "request": base_payload })
            data = response.json()
            ps_payment = Payments.objects.create(order_gateway_id=order_id, gateway='phonepe',
                                    status="created", amount=amount, user=info.context.user, standard=ps_class,
                                    user_email=info.context.user.email, json_response=response.json())
            # data["data"] = str(data["data"])
            return data
        except Exception as e:
            print(e)
            return PhonePeType(success=False, code=response["code"], message=response["message"], data=response["data"])

    def resolve_check_payment_phonepe(self, info, order_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        api_point = f"/pg/v1/status/{env('PHONEPE_MERCHANT_ID')}/{order_id}"
        url = env("PHONEPE_BASE_URL") + api_point

        hash_string = api_point + env('PHONEPE_SECRET')
        hash_sha = hashlib.sha256(hash_string.encode()).hexdigest()

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": hash_sha + "###" + env("PHONEPE_KEY"),
            'X-MERCHANT-ID': env("PHONEPE_MERCHANT_ID"),
        }

        try:
            response = requests.get(url, headers=headers)
            data = response.json()
            payment = Payments.objects.get(order_gateway_id=order_id)
            if (payment.status != "paid" and data["data"]["responseCode"] == "SUCCESS"):
                payment.status = "paid"
                payment.payment_gateway_id = data["data"]["transactionId"]
                payment.json_response = response.json()
                payment.method = data["data"]["paymentInstrument"]["type"]
                payment.save()
            if (payment.status == "paid"):
                enrollment = Enrollment.objects.filter(standard=payment.standard)
                if enrollment.count() == 0:
                    Enrollment.objects.create(user=user, standard=payment.standard, payment=payment,
                                              expiration_date=(datetime.now() + timedelta(days=365)))
            return data
        except Exception as e:
            print(e)
            return PhonePeType(success=False, code=response["code"], message=response["message"], data=response["data"])
