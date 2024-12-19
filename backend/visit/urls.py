from django.urls import path
from .views import MarkerListAPIView, MarkerDetailAPIView

urlpatterns = [
    # Endpoint for listing and creating markers
    path('markers/', MarkerListAPIView.as_view(), name='marker_list'),

    # Endpoint for retrieving, updating, and deleting a specific marker
    path('markers/<int:pk>/', MarkerDetailAPIView.as_view(), name='marker_detail'),
]
