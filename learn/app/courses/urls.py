from django.urls import include, path
from .views import *

app_name = 'courses'

urlpatterns = [
    path('classes/', ClassesView.as_view(), name='classes'),
    path('subject/',  SubjectsView.as_view(), name='subjects'),
    path('chapter/',  ChapterView.as_view(), name='chapters'),
    path("chapter/<int:pk>/", ChapterUpdateView.as_view(), name="chapter-update"),
    path("chapter/<int:pk>/delete/", ChapterDeleteView.as_view(), name="chapter-delete"),
]
