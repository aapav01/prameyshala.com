from django.db.models import Count, F, Sum, Avg
from django.db.models.functions import ExtractYear, ExtractMonth
from app.accounts.models import User, Enrollment, Payments

from .json import JSONView
from ..util import months, colorPrimary, colorSuccess, colorDanger, generate_color_palette, get_year_dict


class SalesChart(JSONView):
    year = None
    sales_dict = get_year_dict()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        year = self.kwargs.get("year")
        purchases = Payments.objects.filter(created_at__year=year)
        grouped_purchases = purchases.annotate(price=F("enrollment_id__bought_price")).annotate(month=ExtractMonth("created_at"))\
            .values("month").annotate(average=Sum("enrollment_id__bought_price")).values("month", "average").order_by("month")

        for group in grouped_purchases:
            self.sales_dict[months[group["month"]-1]
                            ] = round(group["average"], 2)

        context.update({
            "title": f"Sales in {year}",
            "data": {
                "labels": list(self.sales_dict.keys()),
                "datasets": [{
                    "label": "Amount (₹)",
                    "backgroundColor": 'transparent',
                    "borderColor": colorPrimary,
                    "data": list(self.sales_dict.values()),
                }]
            },
        })

        return context
