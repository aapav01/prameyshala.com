from django.contrib.auth.mixins import PermissionRequiredMixin
from django.contrib import messages
from django.shortcuts import render, redirect
from django.views import View
from ..models import Settings, UserSettings


class SettingView(PermissionRequiredMixin, View):
    permission_required = "accounts.view_settings"
    template_name = 'accounts/settings.html'
    context = {
        'title': "General Settings",
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': "General Settings"}]
    }

    def get(self, request):
        return render(request, self.template_name, context=self.context)

    def post(self, request):
        return render(request, self.template_name, context=self.context)


class UserSettings(View):
    template_name = 'accounts/settings.html'
    context = {
        'title': "Your Settings",
        'breadcrumbs': [{'url': 'core:home', 'label': 'Dashboard'}, {'label': "Your Settings"}]
    }

    def get(self, request):
        return render(request, self.template_name, context=self.context)

    def post(self, request):
        return render(request, self.template_name, context=self.context)
