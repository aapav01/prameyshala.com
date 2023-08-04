import base64
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
import environ
import graphene
from phonenumber_field.phonenumber import PhoneNumber
import pyotp
import requests

from ..models import User, phoneModel


env = environ.Env()
environ.Env.read_env()


class generateKey:
    @staticmethod
    def returnValue(phone):
        return str(phone) + str(datetime.date(datetime.now())) + "You Must Be Kidding Me! This is not a key!"


class OTPQuery(graphene.ObjectType):
    get_otp = graphene.String(phone_number=graphene.String(required=True))

    @staticmethod
    def resolve_get_otp(self, info, phone_number):
        temp = phone_number
        phone_number = PhoneNumber.from_string(phone_number)
        phone_number = phone_number.as_national
        phone_number = phone_number.replace(" ", "")[1:]
        try:
            Mobile = phoneModel.objects.get(
                Mobile=PhoneNumber.from_string(temp))
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


class OTPMutation(graphene.ObjectType):
    verify_otp = graphene.String(phone_number=graphene.String(
        required=True), otp=graphene.String(required=True))

    @staticmethod
    def resolve_verify_otp(self, info, phone_number, otp):
        temp = phone_number
        phone_number = PhoneNumber.from_string(phone_number)
        phone_number = phone_number.as_national
        phone_number = phone_number.replace(" ", "")[1:]
        try:
            Mobile = phoneModel.objects.get(
                Mobile=PhoneNumber.from_string(temp))
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
