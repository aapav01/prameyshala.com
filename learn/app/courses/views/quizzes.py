from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db import models
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils.text import slugify
from django.db.models import Count
from ..forms import ChoiceInlineFormSet, ChoiceInlineUpdateFormSet, QuestionForm,  QuizForm
from ..models import Quiz,Lesson
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

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.slug = slugify(instance.name)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': QuizForm})
            return redirect('courses:quizzes')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

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
        ],
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name}"
        context['breadcrumbs'][3] = {'label': f"{self.object.name}"}
        context['form'] = QuizForm(
            instance=self.object, prefix=self.object.pk)
        context['questions'] = self.object.question_set.all()
        for obj in context['questions']:
            temp_form = QuestionForm(instance=obj, prefix=obj.pk)
            quiz = Quiz.objects.get(pk=self.object.pk)
            chapter = quiz.lesson_set.first().chapter
            temp_form.fields['lesson'].queryset = Lesson.objects.filter(chapter=chapter)
            obj.question_form = temp_form
            obj.choice_formset = ChoiceInlineUpdateFormSet(
                instance=obj, prefix=obj.pk)
        if self.request.method == 'POST':
            context['question_form'] = QuestionForm(self.request.POST)
            context['question_form'].choice_formset = ChoiceInlineUpdateFormSet(
                self.request.POST, prefix='question_formset')
        else:
            context['question_form'] = QuestionForm()
            context['question_form'].choice_formset = ChoiceInlineFormSet(
                prefix='question_formset')
        return context

    # create
    def post(self, request, **kwargs):
        form = QuestionForm(request.POST)
        self.extra_context.update({'question_form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.quiz = self.get_object()
            instance.save()
            question_formset = ChoiceInlineFormSet(
                request.POST, instance=instance, prefix='question_formset')
            if question_formset.is_valid():
                question_formset.save()
            else:
                messages.error(
                    request, f'failed to create! please see the create form for more details.')
                return super().get(request, **kwargs)
            messages.success(
                request, f'{instance.question_text} has been created successfully.')
            self.extra_context.update({'form': QuizForm})
            return redirect('courses:quiz-detail', pk=self.get_object().pk)
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class QuizUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")
    template_name = "form.html"
    form = QuizForm
    fields = "__all__"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix

        return kwargs

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class QuizDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_quizzes"
    model = Quiz
    success_url = reverse_lazy("courses:quizzes")

    def get(self, request, **kwargs):
        messages.error(request, 'Quiz has been deleted successfully.')
        return self.delete(request, **kwargs)
