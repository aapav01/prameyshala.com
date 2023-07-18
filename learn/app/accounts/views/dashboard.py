from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Enrollment, User
from django.db.models import Sum
import datetime
from chartjs.views.lines import BaseLineChartView


@login_required()
def home(request):
    title = 'Home'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Home'}]
    context = {'title': title, 'breadcrumbs': breadcrumbs}
    total_amount = Enrollment.objects.aggregate(
        Sum('bought_price'))['bought_price__sum']
    enrollment_count = Enrollment.objects.count()
    user_count = User.objects.count()
    context.update({'enrollment_count': enrollment_count,
                   'user_count': user_count, 'total_amount': total_amount})
    return render(request, 'accounts/home.html', context)


@login_required
def profile(request):
    context = {
        'title': "Profile",
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': "User's Profile"}]
    }
    return render(request, 'accounts/users/profile.html', context)


class MonthlyUserChart(BaseLineChartView):
    users = User.objects.all()
    join_dates = [user.created_at for user in users]

    months = [datetime.date(datetime.date.today().year, month, 1)
              .strftime("%b") for month in range(1, 13)]

    joined_count = [0 for item in range(1, 13)]
    for join_date in join_dates:
        month = join_date.strftime("%b")
        joined_count[months.index(month)] += 1

    def get_providers(self):
        return ["Users"]

    def get_labels(self):
        return self.months

    def get_data(self):
        return [self.joined_count]

    def get_colors(self):
        return list(0,0,0)
