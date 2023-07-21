from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Classes
from ..forms import ClassesForm


class ClassesView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_classes"
    model = Classes
    template_name = "classes/index.html"
    form = ClassesForm
    context_object_name = "classes"
    extra_context = {
        'title': 'Classes',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Classes'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['classes']:
            temp_form = ClassesForm(instance=obj)
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
            messages.success(request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': ClassesForm})
            return redirect('courses:classes')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class ClassesUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_classes"
    model = Classes
    form_class = ClassesForm
    success_url = reverse_lazy("courses:classes")
    template_name = "form.html"

    def form_valid(self, form):
        form.instance.slug = slugify(form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class ClassesDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_classes"
    model = Classes
    success_url = reverse_lazy("courses:classes")

    def get(self, request, **kwargs):
        messages.error(request, 'Class has been deleted successfully.')
        return self.delete(request, **kwargs)
