from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views import View


@login_required()
def home(request):
    title = 'Home'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Home'}]
    context = {'title': title, 'breadcrumbs': breadcrumbs}
    return render(request, 'accounts/home.html', context)
