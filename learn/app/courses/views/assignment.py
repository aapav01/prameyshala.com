from typing import Any, Dict
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView, CreateView
from django.utils.text import slugify
from django.urls import reverse_lazy
from django.db.models import Count
from ..models import Assignment, AssignmentSubmission
from ..forms import AssignmentForm, AssignmentSubmissionForm, AssignmentReviewForm
from django.db.models import Q
from datetime import datetime, timedelta


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
        form = self.form(request.POST,request.FILES)
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

    #searchquery
    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(type__icontains=search_query) |
                Q(teacher__full_name__icontains=search_query)
            )


        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        return context


class AssignmentDetailView(DetailView):
    model = Assignment
    context_object_name = 'assignments'
    template_name = 'assignments/detail.html'



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

class AssignmentSubmissionsView(PermissionRequiredMixin,ListView):
    model = AssignmentSubmission
    context_object_name = "assignment_submissions"
    template_name = "assignment_submissions/index.html"
    permission_required = "courses.view_assignmentsubmission"
    form = AssignmentSubmissionForm
    extra_context = {
        'title': 'Submissions',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'label': 'Assignments'},
            {'label': 'Submissions'}
        ],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = AssignmentSubmission.objects.filter(assignment__id=self.kwargs['pk'])
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['assignment'] = Assignment.objects.get(pk=self.kwargs['pk'])
        return context

class AssignmentReviewView(UpdateView):
    model = AssignmentSubmission
    form_class = AssignmentReviewForm
    context_object_name = 'submission'
    template_name = 'assignment_submissions/review.html'

    def get_success_url(self):
        return reverse_lazy('courses:assignment-submissions', kwargs={'pk': self.object.assignment_id})

    def form_valid(self, form):
        instance = form.save(commit=False)
        instance.reviewed = True
        instance.assignment = self.object.assignment
        instance.student = self.object.student
        instance.save()

        messages.success(
            self.request, f'{instance.student} assignment has been reviewed successfully.'
        )
        return redirect('courses:assignment-submissions', pk=instance.assignment.id)

    def form_invalid(self, form):
        messages.error(
            self.request,
            f'Failed to review! Please see the review form for more details.'
        )
        return self.render_to_response(self.get_context_data(form=form))

class AssignmentSubmitView(CreateView):
    model = AssignmentSubmission
    fields = ['assignment','solution_file']
    template_name="submit/index.html"
    form = AssignmentSubmissionForm
    success_url = reverse_lazy('courses:assignments')

    def form_valid(self, form):
        form.instance.student = self.request.user
        return super().form_valid(form)

