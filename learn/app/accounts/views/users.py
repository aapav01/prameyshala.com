from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import User, Role
from ..forms import UsersForm
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from django.db.models import Q


class UsersView(PermissionRequiredMixin, ListView):
    permission_required = "accounts.view_user"
    model = User
    template_name = "accounts/users/index.html"
    form = UsersForm
    context_object_name = "users"
    extra_context = {
        'title': 'users',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'User Management'}, {'label': 'Users'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = UsersForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.password = make_password(instance.password)
            instance.save()
            messages.success(
                request, f'{instance.full_name} has been created successfully.')
            self.extra_context.update({'form': UsersForm})
            return redirect('accounts:users')
        else:
            messages.error(request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


    #search
    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(full_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(phone_number__icontains=search_query) |
                Q(groups__name__icontains=search_query)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        return context


class UsersUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "accounts.change_user"
    model = User
    form_class = UsersForm
    success_url = reverse_lazy("accounts:users")
    template_name = "courses/form.html"

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.full_name} has been updated successfully.')
        return super().form_valid(form)


class UsersDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "accounts.delete_user"
    model = User
    success_url = reverse_lazy("accounts:users")

    def get(self, request, **kwargs):
        messages.error(request, 'User has been deleted successfully.')
        return self.delete(request, **kwargs)
