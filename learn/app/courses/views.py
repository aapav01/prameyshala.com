from django.shortcuts import render
from django.views import View
from .models import Classes
# Create your views here.


def classes(request):
    title = 'Classes'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Classes'}]
    classes = Classes.objects.all()
    context = {'title': title, 'breadcrumbs': breadcrumbs, 'classes': classes}
    return render(request, 'classes/index.html', context)
