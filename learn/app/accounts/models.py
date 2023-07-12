from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password

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
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, password=password,
                          phone_number=phone_number, **extra_fields)
        user.save(using=self._db)
        return user

    def create_user(self, username, email=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, **extra_fields)

    def create_superuser(self, phone_number, email, full_name, password=None, **extra_fields):
        if not password:
            raise ValueError("User must have a password")
        password = make_password(password)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(full_name, phone_number, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=16, validators=[
                                    phone_validator], unique=True)
    full_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['email', 'full_name']

    def __str__(self):
        return self.full_name + ' - ' + self.email

    @staticmethod
    def has_perm(perm, obj=None, **kwargs):
        return True

    @staticmethod
    def has_module_perms(app_label, **kwargs):
        return True


class phoneModel(models.Model):
    Mobile = models.BigIntegerField(blank=False)
    isVerified = models.BooleanField(blank=False, default=False)
    counter = models.IntegerField(default=0, blank=False)

    def __str__(self):
        return str(self.Mobile)


class Enrollment(models.Model):
    bought_price = models.FloatField()
    payment_method = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=7)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    classes_id = models.ForeignKey('courses.Classes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

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
    created_at = models.DateTimeField(
        auto_now=False, auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        db_table = 'payments'
