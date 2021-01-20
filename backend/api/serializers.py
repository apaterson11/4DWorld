from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from api.models import Profile, Landmark


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class LandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'name', 'latitude', 'longitude', 'description')

class CreateLandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'name', 'latitude', 'longitude', 'description')

