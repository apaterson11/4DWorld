from django.shortcuts import render
from django.contrib.auth.models import Group
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import City, Country, Landmark, LandmarkImage, Map, MapStyle, Project, Profile, State, Layer
from api.serializers import (
    RegisterUserSerializer,
    LandmarkSerializer,
    LandmarkImageSerializer,
    CreateLandmarkSerializer,
    GroupSerializer,
    LayerSerializer,
    UserProjectsSerializer, 
    ProfileDetailsSerializer,
    CountrySerializer,
    StateSerializer,
    CitySerializer,
    MapSerializer,
    MapStyleSerializer,
)

from rest_framework_simplejwt.views import TokenVerifyView


class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = serializer.save()  # .create()?
            if new_user:
                return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsAPIView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileDetailsSerializer
    model = Profile
    queryset = Profile.objects.all()


class GroupAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = GroupSerializer
    model = Group
    queryset = Group.objects.all()

    def perform_create(self, serializer):
        group = serializer.save()
        group.user_set.add(self.request.user)


class LandmarkAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = LandmarkSerializer
    model = Landmark
    queryset = Landmark.objects.all()


class LandmarkImageAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = LandmarkImageSerializer
    model = LandmarkImage
    queryset = LandmarkImage.objects.all()


class LayerAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = LayerSerializer
    model = Layer
    queryset = Layer.objects.all()


class ProjectAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserProjectsSerializer
    model = Project

    def get_queryset(self):
        user = self.request.user
        user_groups = user.groups.all()
        return Project.objects.filter(group__in=user_groups)


class CityAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CitySerializer
    model = City

    def get_queryset(self):
        country_id = self.request.GET.get('country_id')
        state_id = self.request.GET.get('state_id')
        if country_id is None:
            return City.objects.none()
        qs = City.objects.filter(country__id=country_id)
        if state_id is not None:
            return qs.filter(state__id=state_id)
        return qs


class CountryAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = CountrySerializer
    model = Country
    queryset = Country.objects.all()


class StateAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = StateSerializer
    model = State
    
    def get_queryset(self):
        country_id = self.request.GET.get('country_id')
        if country_id is None:
            return State.objects.none()
        return State.objects.filter(country__id=country_id)


class MapStylesAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = MapStyleSerializer
    model = MapStyle
    queryset = MapStyle.objects.all()
    

class MapAPIView(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = MapSerializer
    queryset = Map.objects.all()
    model = Map


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
