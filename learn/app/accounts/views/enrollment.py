from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Enrollment
from ..forms import EnrollmentForm


class EnrollmentView(ListView):
    model = Enrollment
    template_name = "accounts/enrollment/index.html"
    form = EnrollmentForm
    context_object_name = "enrollment"
    extra_context = {
        'title': 'Enrollment',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Accounts'}, {'label': 'Enrollment'}],
        'form': form
    }
    paginate_by = 10

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        for obj in context['enrollment']:
            temp_form = EnrollmentForm(instance=obj)
            obj.form = temp_form
        return context

    # create
    def post(self, request, **kwargs):
        form = self.form(request.POST)
        self.extra_context.update({'form': form})
        if form.is_valid():
            instance = form.save(commit=False)
            instance.slug = slugify(instance.status)
            instance.save()
            messages.success(request, 'Enrolled successfully.')
            self.extra_context.update({'form': EnrollmentForm})
            return redirect('accounts:enrollment')
        else:
            return render(request, self.template_name, self.get_context_data(**kwargs))

class EnrollmentUpdateView(UpdateView):
    model = Enrollment
    form_class = EnrollmentForm
    success_url = reverse_lazy("accounts:enrollment")
    template_name = "form.html"

    def form_valid(self, form):
        form.instance.slug = slugify(form.instance.status)
        messages.info(
            self.request, 'Enrollment has been updated successfully.')
        return super().form_valid(form)


class EnrollmentDeleteView(DeleteView):
    model = Enrollment
    success_url = reverse_lazy("accounts:enrollment")

    def get(self, request, **kwargs):
        messages.error(request, 'Enrollment has been deleted successfully.')
        return self.delete(request, **kwargs)
