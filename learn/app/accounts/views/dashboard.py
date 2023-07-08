from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views import View

@login_required()
def home(request):
    return render(request, 'accounts/home.html')

