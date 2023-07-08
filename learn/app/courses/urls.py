from django.urls import include, path
from . import views

urlpatterns = [
    path('classes/',views.classes,name='classes')
]
