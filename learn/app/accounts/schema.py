import pyotp
import base64
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
import graphene
from graphene_django import DjangoObjectType
from .models import User, Payments, Enrollment, phoneModel


# This class returns the string needed to generate the key
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
        return User.objects.all()

    def resolve_user(self, info, id):
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
        return Payments.objects.all()

    def resolve_payment(self, info, id):
        return Payments.objects.get(pk=id)

    # enrollment
    def resolve_enrollments(self, info):
        return Enrollment.objects.all()

    def resolve_enrollment(self, info, id):
        return Enrollment.objects.get(pk=id)


class Mutation(graphene.ObjectType):
    verify_otp = graphene.String(phone_number=graphene.String(
        required=True), otp=graphene.String(required=True))

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
