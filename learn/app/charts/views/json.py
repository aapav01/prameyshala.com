from django.views.generic import TemplateView
from django.http import JsonResponse
import json


class ComplexEncoder(json.JSONEncoder):
    """Always return JSON primitive."""

    def default(self, obj):
        try:
            return super(ComplexEncoder, obj).default(obj)
        except TypeError:
            if hasattr(obj, "pk"):
                return obj.pk
            return str(obj)


class JSONResponseMixin:
    """
    A mixin that can be used to render a JSON response.
    """

    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(data=context, encoder=ComplexEncoder, **response_kwargs)


class JSONView(JSONResponseMixin, TemplateView):
    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)
