from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User, Enrollment, Payments
from app.courses.models import Classes, Subject, Chapter, Lesson
from datetime import date, datetime
from django.db.models import Sum
from django.contrib.humanize.templatetags.humanize import intcomma

from .json import JSONView
from ..util import get_year_dict


class ChartFliterOptions(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        grouped_users = User.objects.annotate(year=ExtractYear(
            "created_at")).values("year").order_by("-year").distinct()
        years = [user["year"] for user in grouped_users]
        options = {
            "years": years,
            "months": list(get_year_dict().keys()),
            "current_month": list(get_year_dict())[datetime.now().month - 1],
        }
        context.update({
            "options": options
        })
        return context


class DashboardData(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        year = self.kwargs.get("year")
        month = self.kwargs.get("month")
        count = 0
        for mon in get_year_dict().keys():
            count = count + 1
            if mon == month:
                month = count

        # DATA
        # Today
        today = date.today()
        enrollment_count_day = Enrollment.objects.filter(
            created_at__date=today).count()
        payment_amount_day = Payments.objects.filter(status='paid').filter(
            created_at__date=today).aggregate(Sum('amount'))['amount__sum']
        user_today = User.objects.filter(is_active=True).filter(
            created_at__date=today).count()

        # This Month
        payment_amount_month = Payments.objects.filter(status='paid').filter(created_at__year=year).filter(
            created_at__month=month).aggregate(Sum('amount'))['amount__sum']
        enrollment_count_month = Enrollment.objects.filter(
            created_at__year=year).filter(created_at__month=month).count()
        user_this_month = User.objects.filter(is_active=True).filter(
            created_at__month=month).filter(created_at__year=year).count()

        # This Year
        user_this_year = User.objects.filter(
            is_active=True).filter(created_at__year=year).count()
        payment_amount_year = Payments.objects.filter(status='paid').filter(
            created_at__year=year).aggregate(Sum('amount'))['amount__sum']
        enrollment_count_year = Enrollment.objects.filter(
            expiration_date__gt=today).filter(created_at__year=year).count()

        # All Over Time
        enrollment_count = Enrollment.objects.count()
        user_count = User.objects.count()
        class_count = Classes.objects.count()
        subject_count = Subject.objects.count()
        chapter_count = Chapter.objects.count()
        lesson_count = Lesson.objects.count()
        # END DATA

        if payment_amount_month is None:
            payment_amount_month = 0
        if payment_amount_year is None:
            payment_amount_year = 0
        if payment_amount_day is None:
            payment_amount_day = 0

        context.update({
            'enrollment_count': enrollment_count,
            'enrollment_count_day': enrollment_count_day,
            'enrollment_count_month': enrollment_count_month,
            'enrollment_count_year': enrollment_count_year
        })

        context.update({
            'user_count': user_count,
            'user_today': user_today,
            'user_this_month': user_this_month,
            'user_this_year': user_this_year
        })

        context.update({
            'total_amount_day': intcomma(payment_amount_day),
            'total_amount_month': intcomma(payment_amount_month),
            'total_amount_year': intcomma(payment_amount_year)
        })
        context.update({'class_count': class_count})
        context.update({'subject_count': subject_count})
        context.update({'chapter_count': chapter_count})
        context.update({'lesson_count': lesson_count})

        context.update({'today': today})

        return context
