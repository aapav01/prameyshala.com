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
import requests
import graphql_jwt
from phonenumber_field.phonenumber import PhoneNumber


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


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)

class Query(graphene.ObjectType):
    # users
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    me = graphene.Field(UserType)
    get_otp = graphene.String(phone_number=graphene.String(required=True))

    # payments
    payments = graphene.List(PaymentsType)
    payment = graphene.Field(PaymentsType, id=graphene.ID(required=True))

    # enrollment
    enrollments = graphene.List(EnrollmentType)
    enrollment = graphene.Field(EnrollmentType, id=graphene.ID(required=True))

    my_enrollments = graphene.List(EnrollmentType)

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
        temp = phone_number
        phone_number = PhoneNumber.from_string(phone_number)
        phone_number = phone_number.as_national
        phone_number = phone_number.replace(" ", "")[1:]
        try:
            Mobile = phoneModel.objects.get(Mobile=PhoneNumber.from_string(temp))
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
        headers = {
            "accept": "application/json",
            "content-type": "application/*+json",
            "authorization": env('FAST2SMS_API_KEY')
        }
        response = requests.post("https://www.fast2sms.com/dev/bulkV2", headers=headers, json={
            "variables_values": OTP.at(Mobile.counter),
            "numbers": phone_number,
            "route": "otp"
        })
        print(response.json())
        if response.status_code == 200:
            res = response.json()
            if res['return']:
                return "OTP Sent Successfully"
            return str(response.json())
        else:
            return "OTP Sending Failed"

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

    def resolve_my_enrollments(self, info):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication credentials were not provided")
        return Enrollment.objects.filter(user=user).filter(expiration_date__gte=datetime.now())


class Mutation(graphene.ObjectType):
    verify_otp = graphene.String(phone_number=graphene.String(
        required=True), otp=graphene.String(required=True))

    register_user = graphene.Field(UserType, phone_number=graphene.String(required=True),
                                      name=graphene.String(required=True),
                                      email=graphene.String(required=True),
                                      country=graphene.String(required=True),
                                      state=graphene.String(required=True),
                                      city=graphene.String(required=True),
                                      password=graphene.String(required=True))

    create_payment = graphene.Field(
        PaymentsType, amount=graphene.Int(required=True))

    enroll_student = graphene.Field(EnrollmentType,
                                    razorpay_payment_id=graphene.String(
                                        required=True),
                                    amount=graphene.Int(required=True),
                                    ps_payment_id=graphene.ID(required=True),
                                    ps_standard_id=graphene.ID(required=True))

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
        temp = phone_number
        phone_number = PhoneNumber.from_string(phone_number)
        phone_number = phone_number.as_national
        phone_number = phone_number.replace(" ", "")[1:]
        try:
            Mobile = phoneModel.objects.get(Mobile=PhoneNumber.from_string(temp))
        except ObjectDoesNotExist:
            raise Exception("Phone Number Not Found")
        keygen = generateKey()
        key = base64.b32encode(keygen.returnValue(phone_number).encode())
        OTP = pyotp.HOTP(key)
        if OTP.verify(otp, Mobile.counter):
            Mobile.isVerified = True
            Mobile.save()
            return "OTP Verified Successfully"
        else:
            raise Exception("OTP Verification Failed")

    def resolve_register_user(self, info, phone_number, name, email, password, country, state, city):
        try:
            Mobile = phoneModel.objects.get(Mobile=phone_number)
        except ObjectDoesNotExist:
            return "Phone Number Not Found"
        if Mobile.isVerified:
            # check if user exist
            try:
                user = User.objects.get(phone_number=phone_number)
                return "User Already Exists"
            except ObjectDoesNotExist:
                pass
            try:
                user = User.objects.create_user(
                    phone_number=phone_number, full_name=name, email=email, password=password,
                    country=country, state=state, city=city
                )
                return user
            except:
                raise Exception("User Creation Failed")
        else:
            raise Exception("OTP Verification Failed")
