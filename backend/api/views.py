from django.shortcuts import render
from rest_framework import viewsets
from api.models import Landmark
from api.serializers import LandmarkSerializer

# Create your views here.
class LandmarkAPIView(viewsets.ModelViewSet):
    serializer_class = LandmarkSerializer
    model = Landmark
    queryset = Landmark.objects.all()