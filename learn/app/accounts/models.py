from django.db import models
# from app.courses.models import Classes
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

phone_validator = RegexValidator(
    r"^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$", "The phone number provided is invalid")

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=16, validators=[phone_validator], unique=True)
    full_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'full_name']

    def __str__(self):
        return self.email

    @staticmethod
    def has_perm(perm, obj=None, **kwargs):
        return True

    @staticmethod
    def has_module_perms(app_label, **kwargs):
        return True

    @property
    def is_staff(self):
        return self.is_admin

class Enrollment(models.Model):
    bought_price = models.FloatField()
    payment_method = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=7)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    classes_id = models.ForeignKey('courses.Classes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'enrollments'

class Payments(models.Model):
    payment_gateway_id = models.CharField(max_length=255)
    gateway = models.CharField(max_length=255)
    method = models.CharField(max_length=255)
    currency = models.CharField(max_length=255)
    user_email = models.CharField(max_length=255, blank=True, null=True)
    amount = models.CharField(max_length=255)
    json_response = models.TextField()
    enrollment_id = models.ForeignKey(Enrollment, on_delete=models.CASCADE)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'payments'
