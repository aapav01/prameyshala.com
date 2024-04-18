from django.core.exceptions import ObjectDoesNotExist
import graphene
import graphql_jwt
from graphene_django import DjangoObjectType

from ..models import User, phoneModel, ReferralDetails


class UserType(DjangoObjectType):
    class Meta:
        model = User
        exclude = ("password",)


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        return cls(user=info.context.user)


class UserQuery(graphene.ObjectType):
    users = graphene.List(UserType)
    user = graphene.Field(UserType, id=graphene.ID(required=True))
    me = graphene.Field(UserType)

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


class UserMutation(graphene.ObjectType):
    register_user = graphene.Field(UserType, phone_number=graphene.String(required=True),
                                   name=graphene.String(required=True),
                                   email=graphene.String(required=True),
                                   country=graphene.String(required=True),
                                   state=graphene.String(required=True),
                                   city=graphene.String(required=True),
                                   password=graphene.String(required=True),
                                   referred_by=graphene.String(required=False))

    def resolve_register_user(self, info, phone_number, name, email, password, country, state, city, referred_by=None):
        try:
            Mobile = phoneModel.objects.get(Mobile=phone_number)
        except ObjectDoesNotExist:
            return Exception("Phone Number Not Found")
        if Mobile.isVerified:
            # check if user exist
            try:
                user = User.objects.get(phone_number=phone_number)
                raise Exception("User Already Exists")
            except ObjectDoesNotExist:
                pass
            try:
                if referred_by:
                    referred_by_instance = ReferralDetails.objects.get(
                        referral_id=referred_by)
                user = User.objects.create_user(
                    phone_number=phone_number, full_name=name, email=email, password=password,
                    country=country, state=state, city=city, referred_by=referred_by_instance
                )
                return user
            except Exception as e:
                raise e
        else:
            raise Exception("OTP Verification Failed")
