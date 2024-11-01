from django.db.models import Count, F, Sum, Avg
from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User, Enrollment, Payments

from .json import JSONView
from ..util import months, colorPrimary, get_year_dict


class UserChart(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        year = self.kwargs.get("year")
        users = User.objects.filter(created_at__year=year)
        grouped_users = users.annotate(month=ExtractMonth("created_at")).values("month")\
            .annotate(count=Count("id")).order_by("month")

        users_dict = get_year_dict()

        for group in grouped_users:
            users_dict[months[group["month"]-1]] = group["count"]

        context.update({
            "data": {
                "labels": list(users_dict.keys()),
                "datasets": [{
                    "label": "Users",
                    "backgroundColor": colorPrimary,
                    "borderWidth": 1,
                    "borderRadius": 100,
                    "data": list(users_dict.values()),
                }]
            },
        })

        return context
