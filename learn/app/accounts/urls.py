from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.UserLoginView.as_view(), name='login')
]
