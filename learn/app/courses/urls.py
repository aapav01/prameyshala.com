from django.urls import include, path
from . import views

app_name = 'courses'

urlpatterns = [
    path('classes/', views.classes, name='classes')
]
