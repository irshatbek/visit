from django.urls import path
from map_app.views import MarkerListAPIView, MarkerDetailAPIView

urlpatterns = [
    path('api/markers/', MarkerListAPIView.as_view(), name='marker_list'),  # For GET and POST
    path('api/markers/<int:pk>/', MarkerDetailAPIView.as_view(), name='marker_detail'),  # For DELETE
]