import environ
import graphene
from graphene_django import DjangoObjectType
import razorpay
import requests
import hashlib
import shortuuid

from ..models import Payments


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
    data = graphene.String()


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
        PhonePeType, amount=graphene.Int(required=True))

    def resolve_create_payment_razorpay(self, info, amount):
        response = client_rp.order.create({
            "amount": amount * 100,
            "currency": "INR",
        })

        return Payments.objects.create(order_gateway_id=response['id'], gateway='razorpay',
                                       status=response['status'], amount=(response['amount']/100), user=info.context.user,
                                       user_email=info.context.user.email, json_response=response)

    def resolve_create_payment_phonepe(self, info, amount):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        api_point = "/pg/v1/pay"
        url = env("PHONEPE_BASE_URL") + api_point

        order_id = shortuuid.ShortUUID().random(length=18) + str(user.id) + str(amount)

        payload = {
            "merchantId": env("PHONEPE_MERCHANT_ID"),
            "merchantTransactionId": order_id,
            "merchantUserId": user.id,
            "amount": (amount * 100),
            "redirectUrl": "https://webhook.site/b596f550-fe92-4639-96f7-14e8309394e5",
            "redirectMode": "REDIRECT",
            "callbackUrl": "https://webhook.site/b596f550-fe92-4639-96f7-14e8309394e5",
            "mobileNumber": user.phone_number,
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }
        hash_string = str(payload) + api_point + env("PHONEPE_SECRET")
        hash_sha = hashlib.sha256(hash_string.encode()).hexdigest()

        headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": hash_sha + "###" + env("PHONEPE_KEY"),
        }

        try:
            response = requests.post(url, headers=headers, json=payload)
            data = response.json()
            print(data)
            Payments.objects.create(order_gateway_id=order_id, gateway='phonepe',
                                    status="created", amount=amount, user=info.context.user,
                                    user_email=info.context.user.email, json_response=response)
            data["data"] = str(data["data"])
            return data
        except Exception as e:
            print(e)
            return PhonePeType(success=False, code=response["code"], message=response["message"], data=response["data"])
