from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
import environ
import graphene
from graphene_django import DjangoObjectType
import razorpay

from app.courses.models import Classes
from ..models import Enrollment, Payments


env = environ.Env()
environ.Env.read_env()

client = razorpay.Client(
    auth=(env("RAZORPAY_KEY"), env("RAZORPAY_SECRET")))


class EnrollmentType(DjangoObjectType):
    class Meta:
        model = Enrollment
        fields = "__all__"


class EnrollQuery(graphene.ObjectType):
    enrollments = graphene.List(EnrollmentType)
    enrollment = graphene.Field(EnrollmentType, id=graphene.ID(required=True))
    my_enrollments = graphene.List(EnrollmentType)

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


class EnrollMutation(graphene.ObjectType):
    enroll_student = graphene.Field(EnrollmentType,
                                    razorpay_payment_id=graphene.String(
                                        required=True),
                                    amount=graphene.Int(required=True),
                                    ps_payment_id=graphene.ID(required=True),
                                    ps_standard_id=graphene.ID(required=True))

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
