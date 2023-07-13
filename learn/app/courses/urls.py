from django.contrib.auth.decorators import login_required
from django.urls import include, path
from .views import *

app_name = 'courses'

urlpatterns = [
    path('classes/', login_required(ClassesView.as_view()), name='classes'),
    path("classes/<int:pk>/", login_required(ClassesUpdateView.as_view()), name="class-update"),
    path("classes/<int:pk>/delete/", login_required(ClassesDeleteView.as_view()), name="class-delete"),
    path('subjects/',  login_required(SubjectsView.as_view()), name='subjects'),
    path("subject/<int:pk>/", login_required(SubjectUpdateView.as_view()), name="subject-update"),
    path("subject/<int:pk>/delete/", login_required(SubjectDeleteView.as_view()), name="subject-delete"),
    path('chapters/',  login_required(ChapterView.as_view()), name='chapters'),
    path("chapter/<int:pk>/", login_required(ChapterUpdateView.as_view()), name="chapter-update"),
    path("chapter/<int:pk>/delete/", login_required(ChapterDeleteView.as_view()), name="chapter-delete"),
    path('lessons/',  login_required(LessonView.as_view()), name='lessons'),
    path("lesson/<int:pk>/", login_required(LessonUpdateView.as_view()), name="lesson-update"),
    path("lesson/<int:pk>/detail/", login_required(LessonDetailView.as_view()), name="lesson-detail"),
    path("lesson/<int:pk>/delete/", login_required(LessonDeleteView.as_view()), name="lesson-delete"),
]
