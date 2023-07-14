from django.contrib import messages
from django.shortcuts import render, redirect
from django.views.generic import ListView, DetailView
from django.views.generic.edit import UpdateView, DeleteView
from django.utils.text import slugify
from django.urls import reverse_lazy
from ..models import Payments



class PaymentsView(ListView):

    model = Payments
    template_name = "accounts/payments/index.html"
    context_object_name = "payments"
    extra_context = {
        'title': 'Payments',
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': 'Accounts'}, {'label': 'Payments'}],

    }