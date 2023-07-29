from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, CreateView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Quiz, Question, Choice
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
    ordering = ['-created_at']
    queryset = Quiz.objects.annotate(question_count=Count("question__id"))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
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
            questions_data = []
            for key, value in request.POST.items():
                # Check for question field
                if key.startswith('question') and value.strip():
                    question_number = key[8::1]
                    question_text = value
                    question_figure = request.FILES.get(
                        f'figure{question_number}')

                    choices_data = []
                    for subkey, subvalue in request.POST.items():
                        # Check for choice field
                        if subkey.startswith(f'choice{question_number}') and subvalue.strip():
                            choice_text = subvalue
                            # Use the question_number from the data attribute
                            is_correct_key = f'is_correct-{question_number}'
                            is_correct = request.POST.get(
                                is_correct_key) == choice_text
                            choices_data.append(
                                {'choice_text': choice_text, 'is_correct': is_correct})
                    questions_data.append(
                        {'question_text': question_text, 'question_figure': question_figure, 'choices': choices_data})

            # Create and save questions and choices
            for question_data in questions_data:
                question = Question.objects.create(
                    quiz=instance,
                    question_text=question_data['question_text'],
                    figure=question_data['question_figure']
                )
                for choice_data in question_data['choices']:
                    Choice.objects.create(
                        question=question,
                        choice_text=choice_data['choice_text'],
                        is_correct=choice_data['is_correct']
                    )
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
