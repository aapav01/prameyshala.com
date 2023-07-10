from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Lesson
from ..forms import LessonForm


class LessonView(ListView):
    model = Lesson
    template_name = "lessons/index.html"
    form = LessonForm
    context_object_name = "lessons"
    extra_context = {
        'title': 'Lessons',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Lessons'}],
        'form': form
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = LessonForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save()
            messages.success(
                request, f'{instance.title} has been created successfully.')
            form = self.form()
            return redirect('courses:lessons')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class LessonUpdateView(UpdateView):
    model = Lesson
    form_class = LessonForm
    success_url = reverse_lazy("courses:lessons")

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.title} of {form.instance.chapter.name} has been updated successfully.')
        return super().form_valid(form)


class LessonDeleteView(DeleteView):
    model = Lesson
    success_url = reverse_lazy("courses:lessons")

    def get(self, request, **kwargs):
        messages.error(request, 'Lesson has been deleted successfully.')
        return self.delete(request, **kwargs)
