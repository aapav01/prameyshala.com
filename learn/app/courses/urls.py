from django.contrib.auth.decorators import login_required
from django.urls import path
from .views import *


app_name = 'courses'

urlpatterns = [
    path('classes/', login_required(ClassesView.as_view()), name='classes'),
    path('classes/<int:pk>/', login_required(ClassesDetailView.as_view()), name='class-detail'),
    path("classes/<int:pk>/edit", login_required(ClassesUpdateView.as_view()),
         name="class-update"),
    path("classes/<int:pk>/delete/",
         login_required(ClassesDeleteView.as_view()), name="class-delete"),
    path('subjects/',  login_required(SubjectsView.as_view()), name='subjects'),
    path("subject/<int:pk>", login_required(SubjectDetailView.as_view()), name="subject-detail"),
    path("subject/<int:pk>/edit", login_required(SubjectUpdateView.as_view()),
         name="subject-update"),
    path("subject/<int:pk>/delete/",
         login_required(SubjectDeleteView.as_view()), name="subject-delete"),
    path('chapters/',  login_required(ChapterView.as_view()), name='chapters'),
    path("chapter/<int:pk>/", login_required(ChapterUpdateView.as_view()),
         name="chapter-update"),
    path("chapter/<int:pk>/delete/",
         login_required(ChapterDeleteView.as_view()), name="chapter-delete"),
    path('lessons/',  login_required(LessonView.as_view()), name='lessons'),
    path("lesson/<int:pk>/", login_required(LessonUpdateView.as_view()),
         name="lesson-update"),
    path("lesson/<int:pk>/status/",
         login_required(lesson_status_update), name="lesson-status-update"),
    path("lesson/<int:pk>/detail/",
         login_required(LessonDetailView.as_view()), name="lesson-detail"),
    path("lesson/<int:pk>/delete/",
         login_required(LessonDeleteView.as_view()), name="lesson-delete"),
    path('categories/', login_required(CategoriesView.as_view()), name='categories'),
    path("categories/<int:pk>/",
         login_required(CategoriesUpdateView.as_view()), name="category-update"),
    path("categories/<int:pk>/delete/",
         login_required(CategoriesDeleteView.as_view()), name="category-delete"),
    path('quizzes/', login_required(QuizView.as_view()), name='quizzes'),
    path('quizzes/create', login_required(QuizCreateView.as_view()), name='quizzes-create'),
    path("quizzes/<int:pk>/",
         login_required(QuizUpdateView.as_view()), name="quiz-update"),
    path("quizzes/<int:pk>/delete/",
         login_required(QuizDeleteView.as_view()), name="quiz-delete"),
    path("assignments/", login_required(AssignmentListView.as_view()), name="assignments"),
    path("assignment/<int:pk>", login_required(AssignmentUpdateView.as_view()), name="assignment-update"),
    path("assignment/<int:pk>/delete", login_required(AssignmentDeleteView.as_view()), name="assignment-delete"),
    path("assignment/<int:pk>/detail", login_required(AssignmentDetailView.as_view()), name="assignment-detail"),
    path("assignment/<int:pk>/submissions", login_required(AssignmentSubmissionsView.as_view()), name="assignment-submissions"),
    path("assignment/submission/<int:pk>/review", login_required(AssignmentReviewView.as_view()), name="submission-review"),
    path("assignment/submit",login_required(AssignmentSubmitView.as_view()),name='assignment-submit'),
]

