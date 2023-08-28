import environ
import graphene
from graphene_django import DjangoObjectType
import razorpay

from ..models import Payments


env = environ.Env()
environ.Env.read_env()

client = razorpay.Client(
    auth=(env("RAZORPAY_KEY"), env("RAZORPAY_SECRET")))


class PaymentsType(DjangoObjectType):
    class Meta:
        model = Payments
        fields = "__all__"


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

    def resolve_create_payment_razorpay(self, info, amount):
        response = client.order.create({
            "amount": amount * 100,
            "currency": "INR",
        })

        return Payments.objects.create(order_gateway_id=response['id'], gateway='razorpay',
                                       status=response['status'], amount=(response['amount']/100), user=info.context.user,
                                       user_email=info.context.user.email, json_response=response)
