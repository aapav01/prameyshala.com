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



class UsersView(ListView):
    model = User
    template_name = "accounts/users/index.html"
    form = UsersForm
    context_object_name = "users"
    extra_context = {
        'title': 'users',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'User Management'}, {'label': 'Users'}],
        'form': form
    }
    
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
            instance.password=make_password(instance.password)
            instance.slug = slugify(instance.full_name)
            instance.save()
            messages.success(
                request, f'{instance.full_name} has been created successfully.')
            self.extra_context.update({'form': UsersForm})
            return redirect('accounts:users')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))



class UsersUpdateView(UpdateView):
    model = User
    form_class = UsersForm
    success_url = reverse_lazy("accounts:users")
    template_name = "courses/form.html"

    def form_valid(self, form):
        form.instance.slug = slugify(form.instance.full_name)
        messages.info(
            self.request, f'{form.instance.full_name} has been updated successfully.')
        return super().form_valid(form)


class UsersDeleteView(DeleteView):
    model = User
    success_url = reverse_lazy("accounts:users")

    def get(self, request, **kwargs):
        messages.error(request, 'User has been deleted successfully.')
        return self.delete(request, **kwargs)
