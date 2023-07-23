from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from ..models import Enrollment, Payments
from app.courses.models import Classes, Subject, Chapter, Lesson
from django.db.models import Sum
from datetime import date, datetime


User = get_user_model()


@login_required()
def home(request):
    title = 'Home'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Home'}]
    context = {'title': title, 'breadcrumbs': breadcrumbs}

    today = date.today()
    year = datetime.now().year
    month = datetime.now().month  # Month number (1-12) of the desired month
    # Today
    enrollment_count_day = Enrollment.objects.filter(created_at__date=today).count()
    total_amount_day = Payments.objects.filter(status='paid').filter(created_at__date=today).aggregate(Sum('amount'))['amount__sum']
    # This Month
    total_amount_month = Payments.objects.filter(status='paid').filter(created_at__year=year).filter(
        created_at__month=month).aggregate(Sum('amount'))['amount__sum']
    enrollment_count_month = Enrollment.objects.filter(
        created_at__year=year).filter(created_at__month=month).count()

    # All Over Time Enrollment
    enrollment_count = Enrollment.objects.count()
    # All Over Time User
    user_count = User.objects.count()
    user_this_month = User.objects.filter(
        created_at__month=month).filter(created_at__year=year).count()
    user_this_year = User.objects.filter(created_at__year=year).count()
    # All Over Time CLasess
    class_count = Classes.objects.count()
    # All Subjects
    subject_count = Subject.objects.count()
    # All Chapters
    chapter_count = Chapter.objects.count()
    # All Lessons
    lesson_count = Lesson.objects.count()

    # Context
    context.update({
        'enrollment_count_day': enrollment_count_day,
        'enrollment_count': enrollment_count,
        'enrollment_count_month': enrollment_count_month,
        'user_count': user_count,
        'user_this_month': user_this_month,
        'user_this_year': user_this_year,
        'total_amount_day': total_amount_day,
        'total_amount_month': total_amount_month,
        'class_count': class_count,
        'subject_count': subject_count,
        'chapter_count': chapter_count,
        'lesson_count': lesson_count,
    })
    return render(request, 'accounts/home.html', context)


@login_required
def profile(request):
    context = {
        'title': "Profile",
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': "User's Profile"}]
    }
    return render(request, 'accounts/users/profile.html', context)
