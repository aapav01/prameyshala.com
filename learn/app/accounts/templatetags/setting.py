from django import template
from ..models import Settings, UserSettings


register = template.Library()


@register.simple_tag(name='setting')
def settingValue(value):
    if UserSettings.objects.filter(setting_id__name__iexact=value).exists():
        return UserSettings.objects.get(setting_id__name__iexact=value).value
    else:
        return Settings.objects.get(name__iexact=value).value
