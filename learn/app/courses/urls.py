from django.urls import include, path
from .views import *

app_name = 'courses'

urlpatterns = [
    path('classes/', ClassesView.as_view(), name='classes'),
    path('subjects/',  SubjectsView.as_view(), name='subjects'),
    path("subject/<int:pk>/", SubjectUpdateView.as_view(), name="subject-update"),
    path("subject/<int:pk>/delete/", SubjectDeleteView.as_view(), name="subject-delete"),
    path('chapters/',  ChapterView.as_view(), name='chapters'),
    path("chapter/<int:pk>/", ChapterUpdateView.as_view(), name="chapter-update"),
    path("chapter/<int:pk>/delete/", ChapterDeleteView.as_view(), name="chapter-delete"),
    path('lessons/',  LessonView.as_view(), name='lessons'),
    path("lesson/<int:pk>/", LessonUpdateView.as_view(), name="lesson-update"),
    path("lesson/<int:pk>/delete/", LessonDeleteView.as_view(), name="lesson-delete"),
]
