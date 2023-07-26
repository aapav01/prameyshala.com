from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Question
from ..forms import QuestionsForm


class QuestionView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_questions"
    model = Question
    template_name = "questions/index.html"
    form = QuestionsForm
    context_object_name = "questions"
    extra_context = {
        'title': 'Questions',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Questions'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['questions']:
            temp_form = QuestionsForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': QuestionsForm})
            return redirect('courses:questions')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class QuestionUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_questions"
    model = Question
    form_class = QuestionsForm
    success_url = reverse_lazy("courses:questions")
    template_name = "form.html"

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class QuestionDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_questions"
    model = Question
    success_url = reverse_lazy("courses:questions")

    def get(self, request, **kwargs):
        messages.error(request, 'Question has been deleted successfully.')
        return self.delete(request, **kwargs)
