from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView, UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Chapter
from ..forms import ChapterForm


class ChapterView(ListView):
    model = Chapter
    template_name = "chapters/index.html"
    form = ChapterForm
    context_object_name = "chapters"
    extra_context = {'title': 'Chapters', 'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {
        'label': 'Courses'}, {'label': 'Chapters'}], 'form': form}

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


class ChapterUpdateView(UpdateView):
    model = Chapter

    def get(self, request, **kwargs):
        return redirect('courses:chapters')


class ChapterDeleteView(DeleteView):
    model = Chapter
    success_url = reverse_lazy("courses:chapters")

    def get(self, request, **kwargs):
        return self.delete(request, **kwargs)
