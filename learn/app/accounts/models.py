from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from datetime import date, timedelta
from phonenumber_field.modelfields import PhoneNumberField

phone_validator = RegexValidator(
    r"^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$", "The phone number provided is invalid")


class UserManager(BaseUserManager):
    def _create_user(self, full_name, phone_number, email, password=None, **extra_fields):
        if not email:
            raise ValueError("User must have an email")
        if not full_name:
            raise ValueError("User must have a full name")
        if not phone_number:
            raise ValueError("User must have a phone number")
        if password:
            password = make_password(password)
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, password=password,
                          phone_number=phone_number, **extra_fields)
        user.save(using=self._db)
        return user

    def create_user(self, full_name, phone_number, email, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(full_name, phone_number, email, **extra_fields)

    def create_superuser(self, phone_number, email, full_name, password=None, **extra_fields):
        if not password:
            raise ValueError("User must have a password")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(full_name, phone_number, email, password, **extra_fields)


class Role(Group):
    description = models.TextField(blank=True)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=100, unique=True)
    phone_number = PhoneNumberField(max_length=16, unique=True)
    full_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    country = models.CharField(max_length=64, blank=True, null=True, default='IN')
    state = models.CharField(max_length=64, blank=True, null=True)
    city = models.CharField(max_length=64, blank=True, null=True)
    objects = UserManager()
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'full_name']

    def __str__(self):
        return self.full_name + ' - ' + self.email


class phoneModel(models.Model):
    Mobile = models.CharField(blank=False, max_length=20)
    isVerified = models.BooleanField(blank=False, default=False)
    counter = models.IntegerField(default=0, blank=False)

    def __str__(self):
        return str(self.Mobile)


class Payments(models.Model):
    class PaymentStatus(models.TextChoices):
        CREATED = 'created', _('Created')
        ATTEMPTED = 'attempted', _('Authorized/Failed')
        SUCCESS = 'paid', _('Captured')

    payment_gateway_id = models.CharField(max_length=255, blank=True, null=True)
    order_gateway_id = models.CharField(max_length=255, blank=True, null=True)
    gateway = models.CharField(max_length=255)
    method = models.CharField(max_length=255, blank=True, null=True)
    currency = models.CharField(max_length=255, default='INR')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_email = models.CharField(max_length=255, blank=True, null=True)
    amount = models.CharField(max_length=255)
    status = models.CharField(max_length=10,
        choices=PaymentStatus.choices, default=PaymentStatus.CREATED)
    json_response = models.TextField()
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    standard = models.ForeignKey('courses.Classes', on_delete=models.CASCADE)
    payment = models.ForeignKey(Payments, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expiration_date = models.DateField(default=None, blank=True, null=True)

    class Meta:
        db_table = 'enrollments'


class Settings(models.Model):
    name = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    updated_by = models.ForeignKey(User, on_delete=models.NOT_PROVIDED,
                                   related_name='modified_by', default=None, blank=True, null=True)

    class Meta:
        db_table = 'settings'


class UserSettings(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    setting_id = models.ForeignKey(Settings, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
