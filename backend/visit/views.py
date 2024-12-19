from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Marker

class MarkerListAPIView(APIView):
    def get(self, request):
        markers = Marker.objects.all()
        serializer = MarkerSerializer(markers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MarkerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarkerDetailAPIView(APIView):
    def delete(self, request, pk):
        try:
            marker = Marker.objects.get(pk=pk)
            marker.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Marker.DoesNotExist:
            return Response({"error": "Marker not found"}, status=status.HTTP_404_NOT_FOUND)
