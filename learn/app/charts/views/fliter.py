from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User
from datetime import date, datetime

from .json import JSONView
from ..util import get_year_dict


class ChartFliterOptions(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        grouped_users = User.objects.annotate(year=ExtractYear(
            "created_at")).values("year").order_by("-year").distinct()
        years = [user["year"] for user in grouped_users]
        options = {
            "years": years,
            "months": list(get_year_dict().keys()),
            "current_month": list(get_year_dict())[datetime.now().month - 1],
        }
        context.update({
            "options": options
        })
        return context
