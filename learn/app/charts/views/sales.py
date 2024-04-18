from django.db.models import Count, F, Sum, Avg
from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User, Enrollment, Payments

from .json import JSONView
from ..util import months, colorPrimary, colorSuccess, colorDanger, generate_color_palette, get_year_dict


class SalesChart(JSONView):
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        sales_dict = get_year_dict()
        year = self.kwargs.get("year")
        purchases = Payments.objects.filter(
            created_at__year=year).filter(status='paid')
        grouped_purchases = purchases.annotate(price=F("amount")).annotate(month=ExtractMonth("created_at"))\
            .values("month").annotate(average=Sum("amount")).values("month", "average").order_by("month")

        for group in grouped_purchases:
            sales_dict[months[group["month"]-1]
                       ] = round(group["average"], 2)

        context.update({
            "data": {
                "labels": list(sales_dict.keys()),
                "datasets": [{
                    "label": "Amount (₹)",
                    "backgroundColor": '#fff',
                    "borderColor": colorPrimary,
                    "borderRadius": 100,
                    "data": list(sales_dict.values()),
                }]
            },
        })

        return context
