from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin, GroupAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _
from .models import User, Enrollment, Payments, Role


class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    list_display = ('email', 'phone_number',
                    'full_name', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('full_name', 'email', 'phone_number', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',
         'is_superuser', 'last_login', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {'fields': ('full_name', 'phone_number',
         'email', 'password1', 'password2')}),
    )
    search_fields = ('email', 'full_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        is_superuser = request.user.is_superuser
        if is_superuser:
            form.base_fields['is_superuser'].disabled = True
        return form


class RoleAdmin(GroupAdmin):
    list_display = ('name', 'description')
    fieldsets = (
        (None, {'fields': ('name', 'permissions')}),
        (_('Description'), {'fields': ('description',)}),
    )


admin.site.unregister(Group)

admin.site.register(User, UserAdmin)
admin.site.register(Enrollment)
admin.site.register(Payments)
admin.site.register(Role, RoleAdmin)
