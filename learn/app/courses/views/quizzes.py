from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db import models
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, CreateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Count
from ..forms import ChoiceInlineFormSet, QuestionInlineFormSet, QuestionInlineUpdateFormSet, ChoiceInlineUpdateFormSet
from ..models import Quiz
from django.db.models import Q


class QuizView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_quizzes"
    model = Quiz
    template_name = "quizzes/index.html"
    context_object_name = "quizzes"
    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Quizzes'}],
    }
    paginate_by = 10
    ordering = ['-created_at']
    queryset = Quiz.objects.annotate(question_count=Count("question__id"))

    #search
    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(type__iexact=search_query)
            )
        return queryset


class QuizCreateView(PermissionRequiredMixin, CreateView):
    model = Quiz
    permission_required = "courses.add_quizzes"
    fields = "__all__"
    template_name = "quizzes/form.html"
    success_url = reverse_lazy("courses:quizzes")

    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'url': 'courses:quizzes', 'label': 'Quizzes'},
            {'label': 'Create Quiz'},
        ],
        # 'question_formset': QuestionInlineFormSet(prefix='question_formset'),
        # 'choice_formset': ChoiceInlineFormSet(prefix='choice_formset_0'),
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['question_formset'] = QuestionInlineFormSet(prefix='question_formset')
        # context['question_formset'].choice_formset = ChoiceInlineFormSet(prefix='choice_formset_0')
        quesion_count = 0
        for question in context['question_formset']:
            question.choice_formset = ChoiceInlineFormSet(prefix='choice_formset_%s' % quesion_count)
            quesion_count += 1
        return context

    def form_valid(self, form):
        result = super().form_valid(form)

        question_formset = QuestionInlineFormSet(
            form.data, instance=self.object, prefix='question_formset')
        if question_formset.is_valid():
            questions = question_formset.save()

            questions_count = 0
            for question in questions:
                choice_formset = ChoiceInlineFormSet(
                    form.data, instance=question, prefix='choice_formset_%s' % questions_count)
                if choice_formset.is_valid():
                    choice_formset.save()
                questions_count += 1

        return result



class QuizUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")
    template_name = "quizzes/form.html"
    fields = "__all__"

    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'url': 'courses:quizzes', 'label': 'Quizzes'},
            {'label': 'Create Quiz'},
        ],
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['question_formset'] = QuestionInlineUpdateFormSet(instance=self.object, prefix='question_formset')
        #TODO: render this in template
        questions_count = 0
        for question in context['question_formset']:
            question.choice_formset = ChoiceInlineUpdateFormSet(instance=question.instance, prefix='choice_formset_%s' % questions_count)
            questions_count += 1
        return context

    def form_valid(self, form):
        result = super().form_valid(form)
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        question_formset = QuestionInlineUpdateFormSet(self.request.POST, instance=self.object, prefix='question_formset')
        if question_formset.is_valid():
            questions = question_formset.save()
            questions_count = 0
            for question in questions:
                choice_formset = ChoiceInlineUpdateFormSet(
                    self.request.POST, instance=question, prefix='choice_formset_%s' % questions_count)
                if choice_formset.is_valid():
                    choice_formset.save()
                questions_count += 1

        return result


class QuizDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")

    def get(self, request, **kwargs):
        messages.error(request, 'Quiz has been deleted successfully.')
        return self.delete(request, **kwargs)
