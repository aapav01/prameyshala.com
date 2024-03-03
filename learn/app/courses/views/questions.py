from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..forms import QuestionForm
from ..models import Question


class QuestionUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_questions"
    model = Question
    form_class = QuestionForm
    template_name = "form.html"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix
        return kwargs

    def get_success_url(self):
        quiz_id = self.object.quiz_id
        return reverse_lazy('courses:quiz-detail', kwargs={'pk': quiz_id})

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.question_text} has been updated successfully.')
        return super().form_valid(form)


class QuestionDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_question"
    model = Question

    def get_success_url(self):
        quiz_id = self.object.quiz_id
        return reverse_lazy('courses:quiz-detail', kwargs={'pk': quiz_id})

    def get(self, request, **kwargs):
        messages.error(request, 'Question has been deleted successfully.')
        return self.delete(request, **kwargs)
