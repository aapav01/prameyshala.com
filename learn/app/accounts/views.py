from django.shortcuts import render, redirect
from django.views import View
from .backends import EmailPhoneUsernameAuthenticationBackend as EoP
from django.contrib.auth import login
from django.contrib import messages
from .forms import UserLoginForm

class UserLoginView(View):
    form_class = UserLoginForm
    template_name = 'accounts/login.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('core:home')
        return super().dispatch(request, *args, **kwargs)

    def get(self, request):
        form = self.form_class
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        form = self.form_class(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = EoP.authenticate(request, username=cd['email'], password=cd['password'])
            if user is not None:
                login(request, user)
                messages.success(request, 'You have successfully logged in!', 'success')
                return redirect('core:home')
            else:
                messages.error(request, 'Your email or password is incorrect!', 'error')
        return render(request, self.template_name, {'form': form})
