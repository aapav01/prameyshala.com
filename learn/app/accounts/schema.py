import pyotp
import base64
from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
import graphene
from graphene_django import DjangoObjectType
from .models import User, Payments, Enrollment, phoneModel
from app.courses.models import Classes
import environ
import razorpay


env = environ.Env()
environ.Env.read_env()

client = razorpay.Client(
    auth=(env("RAZORPAY_KEY"), env("RAZORPAY_SECRET")))


class generateKey:
    @staticmethod
    def returnValue(phone):
        return str(phone) + str(datetime.date(datetime.now())) + "You Must Be Kidding Me! This is not a key!"


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ("password",)


class PaymentsType(DjangoObjectType):
    class Meta:
        model = Payments
        fields = "__all__"


class EnrollmentType(DjangoObjectType):
    class Meta:
        model = Enrollment
        fields = "__all__"


class Query(graphene.ObjectType):
    # users
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    me = graphene.Field(UserType)
    get_otp = graphene.String(phone_number=graphene.String(required=True))

    # payments
    payments = graphene.List(PaymentsType)
    payment = graphene.Field(PaymentsType, id=graphene.Int(required=True))

    # enrollment
    enrollments = graphene.List(EnrollmentType)
    enrollment = graphene.Field(EnrollmentType, id=graphene.Int(required=True))

    # users
    def resolve_users(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return User.objects.all()

    def resolve_user(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return User.objects.get(pk=id)

    def resolve_me(self, info, **kwargs):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return user

    @staticmethod
    def resolve_get_otp(self, info, phone_number):
        try:
            Mobile = phoneModel.objects.get(Mobile=phone_number)
        except ObjectDoesNotExist:
            phoneModel.objects.create(Mobile=phone_number)
            Mobile = phoneModel.objects.get(Mobile=phone_number)
        Mobile.counter += 1  # increment counter
        Mobile.save()
        keygen = generateKey()
        key = base64.b32encode(keygen.returnValue(phone_number).encode())
        OTP = pyotp.HOTP(key)  # HOTP Model for OTP is created
        print(phone_number + " requested for otp which is " + OTP.at(Mobile.counter))
        # return OTP.at(Mobile.counter)
        return "OTP Sent Successfully"

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

    # enrollment
    def resolve_enrollments(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Enrollment.objects.all()

    def resolve_enrollment(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Enrollment.objects.get(pk=id)


class Mutation(graphene.ObjectType):
    verify_otp = graphene.String(phone_number=graphene.String(
        required=True), otp=graphene.String(required=True))

    create_payment = graphene.Field(
        PaymentsType, amount=graphene.Int(required=True))

    enroll_student = graphene.Field(EnrollmentType,
                                    razorpay_payment_id=graphene.String(
                                        required=True),
                                    amount=graphene.Int(required=True),
                                    ps_payment_id=graphene.Int(required=True),
                                    ps_standard_id=graphene.Int(required=True))

    def resolve_create_payment(self, info, amount):
        response = client.order.create({
            "amount": amount * 100,
            "currency": "INR",
        })

        return Payments.objects.create(order_gateway_id=response['id'], gateway='razorpay',
                                       status=response['status'], amount=(response['amount']/100), user=info.context.user,
                                       user_email=info.context.user.email, json_response=response)

    def resolve_enroll_student(self, info, amount,
                               razorpay_payment_id,
                               ps_payment_id,
                               ps_standard_id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        ps_payment = Payments.objects.get(id=ps_payment_id)
        ps_class = Classes.objects.get(id=ps_standard_id)
        try:
            client.payment.capture(razorpay_payment_id, (amount * 100))
            ps_payment.status = "paid"
            ps_payment.save()
            return Enrollment.objects.create(user=user, standard=ps_class, payment=ps_payment,
                                        expiration_date=(datetime.now() + timedelta(days=365)))
        except:
            raise Exception("Payment Failed")


    @staticmethod
    def resolve_verify_otp(self, info, phone_number, otp):
        try:
            Mobile = phoneModel.objects.get(Mobile=phone_number)
        except ObjectDoesNotExist:
            return "Phone Number Not Found"
        keygen = generateKey()
        key = base64.b32encode(keygen.returnValue(phone_number).encode())
        OTP = pyotp.HOTP(key)
        if OTP.verify(otp, Mobile.counter):
            Mobile.isVerified = True
            Mobile.save()
            return "OTP Verified Successfully"
