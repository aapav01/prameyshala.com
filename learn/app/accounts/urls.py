from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.UserLoginView.as_view(), name='login'),
    path('dashboard/', views.HomeView.as_view(), name='home'),
]
