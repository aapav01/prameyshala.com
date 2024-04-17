from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Classes
from ..forms import ClassesForm, ClassSubjectForm
from django.db.models import Q


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
    ordering = ['-created_at']

    queryset = Classes.objects.annotate(
        enroll_count=Count("enrollment__id")).all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['classes']:
            temp_form = ClassesForm(instance=obj, prefix=obj.pk)
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
            self.extra_context.update({'form': ClassesForm})
            return redirect('courses:classes')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    # searchquery
    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(name__icontains=search_query)

        return queryset


class ClassesDetailView(PermissionRequiredMixin, DetailView):
    permission_required = "courses.view_classes"
    model = Classes
    template_name = "classes/detail.html"
    context_object_name = "standard"
    extra_context = {
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'url': 'courses:classes', 'label': 'Classes'}, {}],
        'form_subject': ClassSubjectForm
    }

    def get_context_data(self, **kwargs: Any) -> dict[str, Any]:
        context = super().get_context_data(**kwargs)
        context['title'] = f"{self.object.name}"
        context['breadcrumbs'][3] = {'label': f"{self.object.name}"}
        context['form'] = ClassesForm(
            instance=self.object, prefix=self.object.pk)
        context['subjects'] = self.object.subject_set.all()
        return context

    def post(self, request, **kwargs):
        form = ClassSubjectForm(request.POST)
        self.extra_context.update({'form_subject': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.standard = self.get_object()
            instance.slug = slugify(
                instance.standard.name + '_' + instance.name)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': ClassSubjectForm})
            return redirect('courses:class-detail', pk=self.get_object().pk)
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class ClassesUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_classes"
    model = Classes
    form_class = ClassesForm
    success_url = reverse_lazy("courses:classes")
    template_name = "form.html"

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        prefix = self.kwargs.get('pk')
        kwargs['prefix'] = prefix
        return kwargs

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
