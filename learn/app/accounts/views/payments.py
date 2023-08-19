from typing import Any
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Payments
from django.db.models import Q



class PaymentsView(PermissionRequiredMixin, ListView):
    permission_required = "accounts.view_payments"
    model = Payments
    template_name = "accounts/payments/index.html"
    context_object_name = "payments"
    extra_context = {
        'title': 'Payments',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Accounts'}, {'label': 'Payments'}],

    }
    paginate_by = 10
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = super().get_queryset()

        search_query = self.request.GET.get('search')
        if search_query:
           queryset = queryset.filter(
               Q(payment_gateway_id__icontains=search_query) |
               Q(user__full_name__icontains=search_query) |
               Q(status__iexact=search_query) |
               Q(method__icontains=search_query)
           )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['search_query'] = self.request.GET.get('search', '')
        return context
