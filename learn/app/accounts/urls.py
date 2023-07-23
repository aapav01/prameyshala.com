from django.contrib.auth.decorators import login_required
from django.urls import path, include
from .views import *

app_name = 'accounts'

urlpatterns = [
    path('', home, name='home'),
    path('account/profile', profile, name='user_profile'),
    path("account/", include("django.contrib.auth.urls")),
    path('account/register/', UserRegisterView.as_view(), name='register'),
    path('account/enrollment/',
         login_required(EnrollmentView.as_view()), name='enrollment'),
    path("account/enrollment/<int:pk>/",
         login_required(EnrollmentUpdateView.as_view()), name="enrolls-update"),
    path("account/enrollment/<int:pk>/delete/",
         login_required(EnrollmentDeleteView.as_view()), name="enrolls-delete"),
    path('account/payments/', login_required(PaymentsView.as_view()), name='payments'),
    path('account/roles', login_required(RolesView.as_view()), name='roles'),
    path("account/roles/<int:pk>/",
         login_required(RolesUpdateView.as_view()), name="role-update"),
    path("account/roles/<int:pk>/delete/",
         login_required(RolesDeleteView.as_view()), name="role-delete"),
    path("account/settings/", login_required(UserSettings.as_view()),
         name="user-settings"),
    path("settings/", login_required(SettingView.as_view()), name="settings"),
    path("account/users", login_required(UsersView.as_view()), name='users'),
    path("account/users/<int:pk>/",
         login_required(UsersUpdateView.as_view()), name="user-update"),
    path("account/users/<int:pk>/delete/",
         login_required(UsersDeleteView.as_view()), name="user-delete"),
]
