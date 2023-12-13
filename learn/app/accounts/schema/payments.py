import environ
import graphene
from graphene_django import DjangoObjectType
import razorpay
import requests
import hashlib
import shortuuid
import base64

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

        base_payload = "{\n"
        base_payload += "\t\"merchantId\": \"" + env("PHONEPE_MERCHANT_ID") + "\",\n"
        base_payload += "\t\"merchantTransactionId\": \"" + order_id + "\",\n"
        base_payload += "\t\"merchantUserId\": \"" + str(user.id) + "\",\n"
        base_payload += "\t\"amount\": " + str(amount * 100) + ",\n"
        base_payload += "\t\"redirectUrl\": \"https://webhook.site/29dc89d4-0c7d-4798-9e78-e12d86a25f91\",\n"
        base_payload += "\t\"redirectMode\": \"REDIRECT\",\n"
        base_payload += "\t\"callbackUrl\": \"https://webhook.site/29dc89d4-0c7d-4798-9e78-e12d86a25f91\",\n"
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
            Payments.objects.create(order_gateway_id=order_id, gateway='phonepe',
                                    status="created", amount=amount, user=info.context.user,
                                    user_email=info.context.user.email, json_response=response.json())
            data["data"] = str(data["data"])
            return data
        except Exception as e:
            print(e)
            return PhonePeType(success=False, code=response["code"], message=response["message"], data=response["data"])
