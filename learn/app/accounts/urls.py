from django.urls import path, include
from .views import *

app_name = 'accounts'

urlpatterns = [
    path('', home, name='home'),
    path('account/profile', profile, name='user_profile'),
    path("account/", include("django.contrib.auth.urls")),
    path('account/register/', UserRegisterView.as_view(), name='register'),
]
