from django.urls import include, path
from .views import *

urlpatterns = [
    path('classes/',ClassesView.as_view(),name='classes')
]
