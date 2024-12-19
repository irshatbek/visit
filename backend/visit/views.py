from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Marker  # Ensure this matches the backend app
from .serializers import MarkerSerializer  # Ensure this matches the backend app

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
    def get(self, request, pk):
        try:
            marker = Marker.objects.get(pk=pk)
            serializer = MarkerSerializer(marker)
            return Response(serializer.data)
        except Marker.DoesNotExist:
            return Response({"error": "Marker not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            marker = Marker.objects.get(pk=pk)
            marker.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Marker.DoesNotExist:
            return Response({"error": "Marker not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            marker = Marker.objects.get(pk=pk)
            serializer = MarkerSerializer(marker, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Marker.DoesNotExist:
            return Response({"error": "Marker not found"}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        try:
            marker = Marker.objects.get(pk=pk)
            serializer = MarkerSerializer(marker, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Marker.DoesNotExist:
            return Response({"error": "Marker not found"}, status=status.HTTP_404_NOT_FOUND)
