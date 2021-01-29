from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import Landmark, Project, Profile
from api.serializers import RegisterUserSerializer, LandmarkSerializer
from api.serializers import RegisterUserSerializer, LandmarkSerializer, CreateLandmarkSerializer, UserProjectsSerializer, UserDetailsSerializer

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

class UserDetailsAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserDetailsSerializer
    model = Profile
    queryset = Profile.objects.all()


class LandmarkAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer
    model = Landmark
    queryset = Landmark.objects.all()

'''
    def put(self, request):
        try:
            serializer = LandmarkSerializer(data=request.data)
            content = request.data.get('content')
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            

            landmark = landmark(content=content, latitude=latitude, longitude=longitude)
            landmark.save()
            return Response(status=status.HTTP_202_ACCEPTED)
            #if serializer.is_valid():
             #   serializer.save()
              #  return Response(serializer.data)
            
        except Exception as e:
            return Response(status=status.HTTP_405_BAD_REQUEST)
            '''

'''
        if serializer.is_valid():
            content = serializer.data.get('content')
            latitude = serializer.data.get('latitude')
            longitude = serializer.data.get('longitude')

            landmark = Landmark(content=content, latitude=latitude, longitude=longitude)
            landmark.save()
    
            return Response(LandmarkSerializer(landmark).data, status=status.HTTP_201_CREATED)
'''
'''
 class CreateLandmark(APIView):
     
     permission_classes = [AllowAny]
     serializer_class = LandmarkSerializer
     def post(self, request):
         serializer = serializer_class(data=request.data)
         if serializer.is_valid():
             name = serializer.data.get('name')
             latitude = serializer.data.get('latitude')
             longitude = serializer.data.get('longitude')
             description = serializer.data.get('description')

             landmark = Landmark(name=name, latitude=latitude, longitude=longitude, description=description)
             landmark.save()

             return Response(LandmarkSerializer(landmark).data, status=status.HTTP_201_CREATED)
             '''
class ProjectAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserProjectsSerializer
    model = Project

    def get_queryset(self):
        user = self.request.user
        user_groups = user.groups.all()
        return Project.objects.filter(group__in=user_groups)
        

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
