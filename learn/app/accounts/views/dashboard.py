from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from ..models import Enrollment
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

    # total_amount and Enrollment for day
    today = date.today()
    start_of_day = datetime.combine(today, datetime.min.time())
    end_of_day = datetime.combine(today, datetime.max.time())
    total_amount_day = Enrollment.objects.filter(created_at__range=(
        start_of_day, end_of_day)).aggregate(Sum('bought_price'))['bought_price__sum']
    enrollment_count_day = Enrollment.objects.filter(
        created_at__range=(start_of_day, end_of_day)).count()

    # total_amount for month
    year = datetime.now().year
    month = datetime.now().month  # Month number (1-12) of the desired month
    start_of_month = datetime(year, month, 1)
    if month == 12:
        end_of_month = datetime(year+1, 1, 1)
    else:
        end_of_month = datetime(year, month+1, 1)
    total_amount_month = Enrollment.objects.filter(created_at__range=(
        start_of_month, end_of_month)).aggregate(Sum('bought_price'))['bought_price__sum']
    # enrollment_count_month = Enrollment.objects.filter(created_at__range=(start_of_month, end_of_month)).count()

    # All Over Time Enrollment
    enrollment_count = Enrollment.objects.count()
    # All Over Time User
    user_count = User.objects.count()
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
        'user_count': user_count,
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
