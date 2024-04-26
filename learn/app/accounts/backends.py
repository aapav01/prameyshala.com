from django.contrib.auth.hashers import check_password
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.core.mail import send_mail
from django.core.mail import send_mail

User = get_user_model()


class EmailPhoneUsernameAuthenticationBackend(ModelBackend):
    @staticmethod
    def authenticate(request, username=None, password=None):
        try:
            user = User.objects.get(
                Q(phone_number=username) | Q(email=username)
            )

        except User.DoesNotExist:
            return None

        if user and check_password(password, user.password):
            if user.email:
                email = user.email
                send_mail(subject="Login Mail",
                          message=f"Hi,{user.full_name}. You have successfully logged in to PrameyShala.\nYour education journey begins.",
                          from_email="admin@prameyshala.com",
                          recipient_list=[email], fail_silently=True)
            return user

        return None

    @staticmethod
    def get_user(user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
