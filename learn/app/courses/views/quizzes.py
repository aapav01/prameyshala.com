from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db import models
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, CreateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Count
from ..forms import ChoiceInlineFormSet, QuestionInlineFormSet, QuestionForm, ChoiceInlineUpdateFormSet, QuizForm
from ..models import Quiz
from django.db.models import Q


class QuizView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_quizzes"
    model = Quiz
    template_name = "quizzes/index.html"
    form = QuizForm
    context_object_name = "quizzes"
    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Quizzes'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']
    queryset = Quiz.objects.annotate(question_count=Count("question__id"))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['quizzes']:
            temp_form = QuizForm(instance=obj, prefix=obj.pk)
            obj.form = temp_form
        return context
    # search

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
        context['question_formset'] = QuestionInlineFormSet(
            prefix='question_formset')
        # context['question_formset'].choice_formset = ChoiceInlineFormSet(prefix='choice_formset_0')
        quesion_count = 0
        for question in context['question_formset']:
            question.choice_formset = ChoiceInlineFormSet(
                prefix='choice_formset_%s' % quesion_count)
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


class QuizDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.change_quizzes"
    model = Quiz
    template_name = "quizzes/detail.html"
    context_object_name = "quiz"

    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'url': 'courses:quizzes', 'label': 'Quizzes'},
            {'label': 'Detail Quiz View'},
        ], 'form_question': QuestionForm
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name}"
        context['breadcrumbs'][3] = {'label': f"{self.object.name}"}
        context['form'] = QuizForm(
            instance=self.object, prefix=self.object.pk)
        context['questions'] = self.object.question_set.all()
        return context

    def post(self, request, **kwargs):
        form = QuestionForm(request.POST)
        self.extra_context.update({'form_question': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.question = self.get_object()
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': QuestionForm})
            return redirect('courses:quiz-detail', pk=self.get_object().pk)
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class QuizUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")
    template_name = "quizzes/form.html"
    form = QuizForm
    fields = "__all__"

    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'url': 'courses:quizzes', 'label': 'Quizzes'},
            {'label': 'Edit Quiz'},
        ],
    }

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix

        return kwargs

    def form_valid(self, form):
        result = super().form_valid(form)
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')

        return result


class QuizDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")

    def get(self, request, **kwargs):
        messages.error(request, 'Quiz has been deleted successfully.')
        return self.delete(request, **kwargs)
