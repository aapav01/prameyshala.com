from django.contrib.auth.decorators import login_required
from django.urls import path, include
from .views import *

app_name = 'accounts'

urlpatterns = [
    path('', home, name='home'),
    path('account/profile', profile, name='user_profile'),
    path("account/", include("django.contrib.auth.urls")),
    path('account/register/', UserRegisterView.as_view(), name='register'),
    path('account/enrollment/', login_required(EnrollmentView.as_view()), name='enrollment'),
     path("account/enrollment/<int:pk>/", login_required(EnrollmentUpdateView.as_view()), name="enrolls-update"),
    path("classes/<int:pk>/delete/", login_required(EnrollmentDeleteView.as_view()), name="enrolls-delete"),
    path('account/payments/', login_required(PaymentsView.as_view()), name='payments'),
]

