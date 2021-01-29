from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer
from api.models import Landmark, Profile, Project


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)

class UserProjectsSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'creator', 'group')

class LandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'content', 'latitude', 'longitude')

class CreateLandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'content', 'latitude', 'longitude')

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'email')

class UserDetailsSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('id', 'department', 'user')

    def update(self, instance, validated_data):
        user = validated_data.pop('user')
        instance.department = validated_data.get('department', instance.department)
        instance.save()

        # update associated user
        instance.user.first_name = user.get('first_name', instance.user.first_name)
        instance.user.email = user.get('email', instance.user.email)
        instance.user.save()
        return instance

