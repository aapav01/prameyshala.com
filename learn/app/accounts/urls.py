from django.urls import path, include
from .views import *

app_name = 'accounts'

urlpatterns = [
    path('', home, name='home'),
    path("accounts/", include("django.contrib.auth.urls")),
]
