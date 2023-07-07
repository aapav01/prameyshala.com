from django import forms


class UserLoginForm(forms.Form):
    phone_number = forms.CharField(max_length=50, widget=forms.TextInput(attrs={
        'class': 'input input-bordered mt-2 mb-4', 'type': 'tel', 'placeholder': 'Phone Number'}),
        label='Phone Number'
    )
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'input input-bordered mt-2', 'placeholder': 'Password'}))
