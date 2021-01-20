from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Landmark
from api.serializers import RegisterUserSerializer, LandmarkSerializer
from api.serializers import RegisterUserSerializer, LandmarkSerializer, CreateLandmarkSerializer

from rest_framework_simplejwt.views import TokenVerifyView


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = serializer.save()    #.create()?
            if new_user:
                return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LandmarkAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer
    model = Landmark
    queryset = Landmark.objects.all()

# class CreateLandmark(APIView):
#     permission_classes = [AllowAny]
#     serializer_class = LandmarkSerializer
#     def post(self, request):
#         serializer = serializer_class(data=request.data)
#         if serializer.is_valid():
#             name = serializer.data.get('name')
#             latitude = serializer.data.get('latitude')
#             longitude = serializer.data.get('longitude')
#             description = serializer.data.get('description')

#             landmark = Landmark(name=name, latitude=latitude, longitude=longitude, description=description)
#             landmark.save()

#             return Response(LandmarkSerializer(landmark).data, status=status.HTTP_201_CREATED)


class BlacklistTokenUpdateView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = ()

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
