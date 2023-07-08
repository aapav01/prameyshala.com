from django.shortcuts import render, get_object_or_404
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

def subject_detail(request, subject_id):
    subject = get_object_or_404(subject, pk=subject_id)
    return render(request, 'courses/subject_detail.html', {'subject': subject})
