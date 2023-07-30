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
    }
    paginate_by = 10
    ordering = ['-created_at']


class AssignmentDetailView(DetailView):
    pass


class AssignmentUpdateView(PermissionRequiredMixin, UpdateView):
     model = Assignment
     form_class = AssignmentForm
     permission_required = "courses.change_assignment"
     template_name = "form.html"
     success_url = reverse_lazy('courses:assigments')


     def form_valid(self, form):
        instance = form.save(commit=False)
        instance.updated_by = self.request.user
        instance.save()
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class AssignmentDeleteView(PermissionRequiredMixin, DeleteView):
    model = Assignment
    success_url = reverse_lazy('courses:assigments')
    permission_required = 'courses.delete_assignment'
