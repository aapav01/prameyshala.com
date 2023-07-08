from django import forms


class UserLoginForm(forms.Form):
    phone_number = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'class': 'input input-bordered mt-2 mb-4', 'type': 'tel', 'placeholder': 'Phone Number'}),
        label='Phone Number'
    )
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'input input-bordered mt-2', 'placeholder': 'Password'}))

class UserRegisterForm(forms.Form):
    full_name = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'placeholder': 'Full Name'}), label='Full Name')
    phone_number = forms.CharField(max_length=50, widget=forms.TextInput(attrs={'type': 'tel', 'placeholder': 'Phone Number'}),
        label='Phone Number'
    )
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'me@example.com'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}), label='Confirm Password')
