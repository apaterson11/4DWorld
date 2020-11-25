from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Landmark
from api.serializers import RegisterUserSerializer, LandmarkSerializer


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = serializer.save()
            if new_user:
                return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        print('hi')
        return Response(status=status.HTTP_200_OK)


class LandmarkAPIView(viewsets.ModelViewSet):
    serializer_class = LandmarkSerializer
    model = Landmark
    queryset = Landmark.objects.all()