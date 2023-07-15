from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views import View
from ..models import Enrollment, User
from django.db.models import Sum

@login_required()
def home(request):
    title = 'Home'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Home'}]
    context = {'title': title, 'breadcrumbs': breadcrumbs}
    total_amount = Enrollment.objects.aggregate(Sum('bought_price'))['bought_price__sum']
    enrollment_count = Enrollment.objects.count()
    user_count = User.objects.count()
    context.update({'enrollment_count': enrollment_count, 'user_count':user_count, 'total_amount': total_amount})
    return render(request, 'accounts/home.html', context)


@login_required
def profile(request):
    context = {
        'title': "Profile",
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': "User's Profile"}]
    }
    return render(request, 'accounts/users/profile.html', context)
