from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Quiz
from ..forms import QuizzesForm


class QuizView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_quizzes"
    model = Quiz
    template_name = "quizzes/index.html"
    form = QuizzesForm
    context_object_name = "quizzes"
    extra_context = {
        'title': 'Quizzes',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Quizzes'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['quizzes']:
            temp_form = QuizzesForm(instance=obj)
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
            self.extra_context.update({'form': QuizzesForm})
            return redirect('courses:quizzes')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class QuizUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_quizzes"
    model = Quiz
    form_class = QuizzesForm
    success_url = reverse_lazy("courses:quizzes")
    template_name = "form.html"

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
