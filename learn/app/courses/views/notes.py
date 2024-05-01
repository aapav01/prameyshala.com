from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, CreateView, DetailView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.db.models import Q
from ..models import Notes
from ..forms import NotesForm


class NotesView(PermissionRequiredMixin, ListView):
    model = Notes
    context_object_name = 'notes_list'
    template_name = 'notes/index.html'
    permission_required = "courses.view_notes"
    form = NotesForm
    extra_context = {
        'title': 'Notes',
        'breadcrumbs': [
            {'url': 'core:home', 'label': 'Dashboard'},
            {'label': 'Courses'},
            {'label': 'Notes'}
        ],
        'form': form
    }
    paginate_by = 10
    ordering = ['-chapter__created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        for obj in context[self.context_object_name]:
            temp_form = NotesForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST, request.FILES)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.created_by = request.user
            instance.save()
            messages.success(
                request, f'{instance.title} has been created successfully.')
            self.extra_context.update({'form': NotesForm})
            return redirect('courses:notes')
        else:
            messages.error(
                request, f'Failed to create! Please see the create form for more details.')
            return super().get(request, **kwargs)

    # search query
    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(chapter__title__icontains=search_query)
            )

        return queryset


class NotesDetailView(DetailView):
    model = Notes
    context_object_name = 'notes'
    template_name = 'notes/detail.html'


class NotesUpdateView(PermissionRequiredMixin, UpdateView):
    model = Notes
    form_class = NotesForm
    permission_required = "courses.change_notes"
    template_name = "form.html"
    success_url = reverse_lazy('courses:notes')

    def form_valid(self, form):
        instance = form.save(commit=False)
        instance.updated_by = self.request.user
        instance.save()
        messages.info(
            self.request, f'{form.instance.title} has been updated successfully.')
        return super().form_valid(form)


class NotesDeleteView(PermissionRequiredMixin, DeleteView):
    model = Notes
    success_url = reverse_lazy('courses:notes')
    permission_required = 'courses.delete_notes'

    def get(self, request, **kwargs):
        messages.error(request, 'Notes have been deleted successfully.')
        return self.delete(request, **kwargs)
