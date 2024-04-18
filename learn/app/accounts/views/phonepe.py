from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from ..models import PhonePeResponse


@csrf_exempt
def repsonseCapture(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            response = PhonePeResponse.objects.create(response=data.response)
            response_data = {'message': f'ok'}
            return JsonResponse(response_data)
        except json.JSONDecodeError:
            response_data = {'message': f'failed'}
            return JsonResponse(response_data, status=400)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)
