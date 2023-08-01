from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Assignment, AssignmentSubmission
from ..forms import AssignmentForm


class AssignmentListView(PermissionRequiredMixin, ListView):
    model = Assignment
    context_object_name = 'assignments'
    template_name = 'assignments/index.html'
    permission_required = "courses.view_assignment"
    form = AssignmentForm
    extra_context = {
        'title': 'Assignments',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'label': 'Assignments'}
        ],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = AssignmentForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.created_by = request.user
            instance.save()
            messages.success(
                request, f'{instance.title} has been created successfully.')
            self.extra_context.update({'form': AssignmentForm})
            return redirect('courses:assignments')
        else:
            messages.error(request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class AssignmentDetailView(DetailView):
    pass


class AssignmentUpdateView(PermissionRequiredMixin, UpdateView):
     model = Assignment
     form_class = AssignmentForm
     permission_required = "courses.change_assignment"
     template_name = "form.html"
     success_url = reverse_lazy('courses:assignments')


     def form_valid(self, form):
        instance = form.save(commit=False)
        instance.updated_by = self.request.user
        instance.save()
        messages.info(
            self.request, f'{form.instance.title} has been updated successfully.')
        return super().form_valid(form)


class AssignmentDeleteView(PermissionRequiredMixin, DeleteView):
    model = Assignment
    success_url = reverse_lazy('courses:assignments')
    permission_required = 'courses.delete_assignment'

    def get(self, request, **kwargs):
        messages.error(request, 'Assignment has been deleted successfully.')
        return self.delete(request, **kwargs)
