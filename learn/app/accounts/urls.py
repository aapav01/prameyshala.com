from django.urls import path, include
from .views import *

app_name = 'accounts'

urlpatterns = [
    path('', home, name='home'),
    path("account/", include("django.contrib.auth.urls")),
    path('account/register/', UserRegisterView.as_view(), name='register'),
]
