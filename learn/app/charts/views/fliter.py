from app.accounts.models import User

from .json import JSONView


class ChartFliterOptions(JSONView):
    # IDK why this is not working
    # User.objects.raw('SELECT DISTINCT year(created_at) AS year FROM accounts_user')
    # years = Subject.objects.annotate(year=ExtractYear('created_at')).values('year').distinct()
    years = []
    for obj in User.objects.all():
        year = obj.created_at.year
        if year not in years:
            years.append(year)
    years.sort(reverse=True)

    extra_context = {
        "options": years
    }
