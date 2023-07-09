from django.shortcuts import render, redirect, get_object_or_404
from django.views import View
from ..models import Subject
from ..forms import *


class SubjectsView(View):
    model = Subject
    template_name = 'subjects/index.html'
    form = SubjectForm
    title = 'Subjects'
    breadcrumbs = [{'url': 'core:home',
                    'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Subjects'}]
    context = {
        'title': 'Subjects',
        'breadcrumbs': breadcrumbs,
    }

    # list
    def get(self, request):
        subjects = self.model.objects.all()
        self.context.update({'subjects': subjects})
        return render(request, self.template_name, self.context)

    # create
    def post(self, request, *args):
        form = form(request.POST)
        self.context.update({'form': form})
        if form.is_valid():
            name = form.cleaned_data['name']
            description = form.cleaned_data['description']
            # image = form.cleaned_data['image']
            slug = form.cleaned_data['slug']
            position = form.cleaned_data['position']
            publish_at = form.cleaned_data['publish_at']
            # image, #todo: add image
            subject = self.model(name, description, slug, position, publish_at)
            subject.save()
            return redirect('subjects')
        return render(request, self.template_name, self.context)
