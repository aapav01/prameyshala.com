from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Subject
from ..forms import SubjectForm


class SubjectsView(ListView):
    model = Subject
    template_name = 'subjects/index.html'
    form = SubjectForm
    context_object_name = "subjects"
    extra_context = {
        'title': 'Subjects',
        'breadcrumbs': [{'url': 'core:home',
                         'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Subjects'}],
        'form': form
    }

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            messages.success(request, 'Chapter created successfully.')
            form.save()
            return redirect('courses:chapters')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class SubjectUpdateView(UpdateView):
    model = Subject

    def get(self, request, **kwargs):
        return redirect('courses:subjects')


class SubjectDeleteView(DeleteView):
    model = Subject
    success_url = reverse_lazy("subjects")

    def get(self, request, **kwargs):
        return redirect('courses:subjects')
