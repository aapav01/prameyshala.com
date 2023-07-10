from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Chapter
from ..forms import ChapterForm


class ChapterView(ListView):
    model = Chapter
    template_name = "chapters/index.html"
    form = ChapterForm
    context_object_name = "chapters"
    extra_context = {
        'title': 'Chapters',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Chapters'}],
        'form': form
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = ChapterForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': ChapterForm})
            return redirect('courses:chapters')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class ChapterUpdateView(UpdateView):
    model = Chapter
    form_class = ChapterForm
    success_url = reverse_lazy("courses:chapters")

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.name} of {form.instance.course.name} has been updated successfully.')
        return super().form_valid(form)


class ChapterDeleteView(DeleteView):
    model = Chapter
    success_url = reverse_lazy("courses:chapters")

    def get(self, request, **kwargs):
        messages.error(request, 'Chapter has been deleted successfully.')
        return self.delete(request, **kwargs)
