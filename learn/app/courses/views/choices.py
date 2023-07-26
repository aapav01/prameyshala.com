from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import Choice
from ..forms import ChoicesForm


class ChoiceView(PermissionRequiredMixin, ListView):
    permission_required = "courses.view_choices"
    model = Choice
    template_name = "choices/index.html"
    form = ChoicesForm
    context_object_name = "choices"
    extra_context = {
        'title': 'Choices',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Courses'}, {'label': 'Choices'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['choices']:
            temp_form = ChoicesForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.save()
            messages.success(
                request, f'{instance.name} has been created successfully.')
            self.extra_context.update({'form': ChoicesForm})
            return redirect('courses:choices')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))


class ChoiceUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "courses.change_choices"
    model = Choice
    form_class = ChoicesForm
    success_url = reverse_lazy("courses:choices")
    template_name = "form.html"

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.name} has been updated successfully.')
        return super().form_valid(form)


class ChoiceDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "courses.delete_choices"
    model = Choice
    success_url = reverse_lazy("courses:choices")

    def get(self, request, **kwargs):
        messages.error(request, 'Choice has been deleted successfully.')
        return self.delete(request, **kwargs)
