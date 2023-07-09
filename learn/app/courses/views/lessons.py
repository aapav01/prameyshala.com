from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Lesson
from ..forms import LessonForm


class LessonView(ListView):
    model = Lesson
    template_name = "lessons/index.html"
    form = LessonForm
    context_object_name = "lessons"
    extra_context = {'title': 'Lessons', 'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {
        'label': 'Courses'}, {'label': 'Classes'}], 'form': form}

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


class LessonUpdateView(UpdateView):
    model = Lesson

    def get(self, request, **kwargs):
        return redirect('courses:chapters')


class LessonDeleteView(DeleteView):
    model = Lesson
    success_url = reverse_lazy("chapters")

    def get(self, request, **kwargs):
        return redirect('courses:chapters')
