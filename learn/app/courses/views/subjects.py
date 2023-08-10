from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Subject
from ..forms import SubjectForm


class SubjectsView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_subject"
    model = Subject
    template_name = "subjects/index.html"
    form = SubjectForm
    context_object_name = "subjects"
    extra_context = {
        'title': 'Subjects',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Subjects'}],
        'form': form
    }
    paginate_by = 10

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
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': SubjectForm})
            return redirect('courses:subjects')
        else:
            messages.error(request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        subject_name = self.request.GET.get('subject')

        if subject_name:
            queryset = queryset.filter(name__icontains=subject_name)

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        context['role_filter'] = self.request.GET.get('role', '')
        context['subject_filter'] = self.request.GET.get('subject', '')
        return context

class SubjectUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_subject"
    model = Subject
    form_class = SubjectForm
    success_url = reverse_lazy("courses:subjects")
    template_name = "form.html"

    def form_valid(self, form):
        form.instance.slug = slugify(
            form.instance.standard.name + '_' + form.instance.name)
        messages.info(
            self.request, f'{form.instance.name} of {form.instance.standard.name} has been updated successfully.')
        return super().form_valid(form)


class SubjectDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_subject"
    model = Subject
    success_url = reverse_lazy("courses:subjects")

    def get(self, request, **kwargs):
        messages.error(request, 'Subject has been deleted successfully.')
        return self.delete(request, **kwargs)
