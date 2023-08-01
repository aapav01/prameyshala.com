from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Role
from ..forms import RolesForm


class RolesView(PermissionRequiredMixin, ListView):
    permission_required = "accounts.view_role"
    model = Role
    template_name = "accounts/roles/index.html"
    form = RolesForm
    context_object_name = "roles"
    extra_context = {
        'title': 'Roles',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'User Management'}, {'label': 'Roles'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context[self.context_object_name]:
            temp_form = RolesForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.save()
            permissions = form.cleaned_data['permissions']
            instance.permissions.set(permissions)
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': RolesForm})
            return redirect('accounts:roles')
        else:
            messages.error(request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)


class RolesUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "accounts.change_role"
    model = Role
    form_class = RolesForm
    success_url = reverse_lazy("accounts:roles")
    template_name = "courses/form.html"

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class RolesDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "accounts.delete_role"
    model = Role
    success_url = reverse_lazy("accounts:roles")

    def get(self, request, **kwargs):
        messages.error(request, 'Role has been deleted successfully.')
        return self.delete(request, **kwargs)
