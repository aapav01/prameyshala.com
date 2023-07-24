from django.contrib.auth.decorators import login_required
from django.urls import path, include
from .views import *

app_name = 'charts'

urlpatterns = [
    path("filter-options/", ChartFliterOptions.as_view(), name="filter-options"),
    path("dashboard-data/<month>/<int:year>", login_required(DashboardData.as_view()),
         name="dashboard-data"),
    path("sales/<int:year>/", SalesChart.as_view(), name="chart-sales"),
    path("users/<int:year>/", UserChart.as_view(), name="chart-users"),
]
