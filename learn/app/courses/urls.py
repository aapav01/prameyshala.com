from django.urls import include, path
from . import views

app_name = 'courses'

urlpatterns = [
    path('classes/', views.classes, name='classes'),
    path('subject/<int:subject_id>/',
         views.subject_detail, name='subject.detail'),
]
