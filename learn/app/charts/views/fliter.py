from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User

from .json import JSONView


class ChartFliterOptions(JSONView):
    grouped_users = User.objects.annotate(year=ExtractYear("created_at")).values("year").order_by("-year").distinct()
    options = [user["year"] for user in grouped_users]

    extra_context = {
        "options": options
    }
