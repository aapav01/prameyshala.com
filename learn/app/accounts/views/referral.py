from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.urls import reverse_lazy
from ..models import User, ReferralDetails
from ..forms import ReferralsForm
from django.db.models import Q


class ReferralsView(PermissionRequiredMixin, ListView):
    permission_required = "accounts.view_referraldetails"
    model = ReferralDetails
    template_name = "accounts/referral/index.html"
    form = ReferralsForm
    context_object_name = "referrals"
    extra_context = {
        'title': 'Referrals',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'User Management'}, {'label': 'Referrals'}],
        'form': form
    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        for obj in context[self.context_object_name]:
            temp_form = ReferralsForm(instance=obj)
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
                request, f'{instance.referral_name} referral has been created successfully.')
            self.extra_context.update({'form': ReferralsForm})
            return redirect('accounts:referrals')
        else:
            messages.error(
                request, f'failed to create! please see the create form for more details.')
            return super().get(request, **kwargs)

    # search

    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(referral_name__icontains=search_query) |
                Q(referral_id__icontains=search_query)
            )
        return queryset


# class ReferralsDetailView(DetailView):
#     permission_required = "accounts.view_referraldetails"
#     model = ReferralDetails
#     template_name = "accounts/users/profile.html"
#     context_object_name = "user"
#     extra_context = {
#         'title': 'User Details',
#         'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'User Management'}, {'label': 'Users', 'url': 'accounts:users'}, {'label': 'User Details'}],
#     }


class ReferralsUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = "accounts.change_referraldetails"
    model = ReferralDetails
    form_class = ReferralsForm
    success_url = reverse_lazy("accounts:referrals")
    template_name = "courses/form.html"

    def form_valid(self, form):
        messages.info(
            self.request, f'{form.instance.referral_name} has been updated successfully.')
        return super().form_valid(form)


class ReferralsDeleteView(PermissionRequiredMixin, DeleteView):
    permission_required = "accounts.delete_referraldetails"
    model = ReferralDetails
    success_url = reverse_lazy("accounts:referrals")

    def get(self, request, **kwargs):
        messages.error(request, 'Referral has been deleted successfully.')
        return self.delete(request, **kwargs)
