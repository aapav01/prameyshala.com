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
    payment_amount_day = Payments.objects.filter(status='paid').filter(created_at__date=today).aggregate(Sum('amount'))['amount__sum']
    user_today = User.objects.filter(is_active=True).filter(created_at__date=today).count()

    # This Month
    payment_amount_month = Payments.objects.filter(status='paid').filter(created_at__year=year).filter(
        created_at__month=month).aggregate(Sum('amount'))['amount__sum']
    enrollment_count_month = Enrollment.objects.filter(
        created_at__year=year).filter(created_at__month=month).count()
    user_this_month = User.objects.filter(is_active=True).filter(
        created_at__month=month).filter(created_at__year=year).count()

    # This Year
    user_this_year = User.objects.filter(is_active=True).filter(created_at__year=year).count()
    payment_amount_year = Payments.objects.filter(status='paid').filter(created_at__year=year).aggregate(Sum('amount'))['amount__sum']
    enrollment_count_year = Enrollment.objects.filter(expiration_date__gt=today).filter(created_at__year=year).count()

    # All Over Time
    enrollment_count = Enrollment.objects.count()
    user_count = User.objects.count()
    class_count = Classes.objects.count()
    subject_count = Subject.objects.count()
    chapter_count = Chapter.objects.count()
    lesson_count = Lesson.objects.count()

    # Context
    context.update({
        'enrollment_count': enrollment_count,
        'enrollment_count_day': enrollment_count_day,
        'enrollment_count_month': enrollment_count_month,
        'enrollment_count_year': enrollment_count_year,
        'user_count': user_count,
        'user_today': user_today,
        'user_this_month': user_this_month,
        'user_this_year': user_this_year,
        'total_amount_day': payment_amount_day,
        'total_amount_month': payment_amount_month,
        'total_amount_year': payment_amount_year,
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
