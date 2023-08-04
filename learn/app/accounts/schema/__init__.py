import graphene
from .users import *
from .otp import *
from .enrollments import *
from .payments import *


class Query(EnrollQuery, OTPQuery, UserQuery, PaymentQuery, graphene.ObjectType):
    pass


class Mutation(EnrollMutation, OTPMutation, UserMutation, PaymentMutation, graphene.ObjectType):
    pass
