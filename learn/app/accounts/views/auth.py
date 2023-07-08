from django.contrib import messages
from django.shortcuts import render, redirect
from django.views import View
from app.accounts.forms import UserRegisterForm


class UserRegisterView(View):
    form_class = UserRegisterForm
    template_name = 'registration/register.html'

    def get(self, request):
        form = self.form_class
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            pass
        return render(request, self.template_name, {'form': form})
