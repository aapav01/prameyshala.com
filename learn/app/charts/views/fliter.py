from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User

from .json import JSONView


class ChartFliterOptions(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        grouped_users = User.objects.annotate(year=ExtractYear(
            "created_at")).values("year").order_by("-year").distinct()
        options = [user["year"] for user in grouped_users]
        context.update({
            "options": options
        })
        return context
