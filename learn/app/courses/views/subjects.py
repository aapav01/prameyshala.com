from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Subject
from ..forms import SubjectForm


class SubjectsView(ListView):
    model = Subject
    template_name = "subjects/index.html"
    form = SubjectForm
    context_object_name = "subjects"
    extra_context = {
        'title': 'Subjects',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Subjects'}],
        'form': form
    }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = SubjectForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.publish_at = timezone.now()
            instance.slug = slugify(
                instance.standard.name + '_' + instance.name)
            instance.save()
            form = self.form()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            return redirect('courses:subjects')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class SubjectUpdateView(UpdateView):
    model = Subject
    form_class = SubjectForm
    success_url = reverse_lazy("courses:subjects")

    def form_valid(self, form):
        form.instance.slug = slugify(
            form.instance.standard.name + '_' + form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} of {form.instance.standard.name} has been updated successfully.')
        return super().form_valid(form)


class SubjectDeleteView(DeleteView):
    model = Subject
    success_url = reverse_lazy("courses:subjects")

    def get(self, request, **kwargs):
        messages.error(request, 'Subject has been deleted successfully.')
        return self.delete(request, **kwargs)
