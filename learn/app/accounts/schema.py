import graphene
from graphene_django import DjangoObjectType
from .models import User, Payments, Enrollment


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
