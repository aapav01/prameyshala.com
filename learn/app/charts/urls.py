from django.urls import path, include
from .views import *

app_name = 'charts'

urlpatterns = [
    path("filter-options/", ChartFliterOptions.as_view(), name="filter-options"),
    path("sales/<int:year>/", SalesChart.as_view(), name="chart-sales"),
]

