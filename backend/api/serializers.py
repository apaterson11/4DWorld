from django.contrib.auth.models import Group, User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from api.models import Landmark, LandmarkImage, Profile, Project, Layer


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class GroupSerializer(ModelSerializer):
    user_count = serializers.SerializerMethodField('get_user_count')

    def get_user_count(self, obj):
        return obj.user_set.count()

    class Meta:
        model = Group
        fields = ('id', 'name', 'user_count')


class UserProjectsSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'creator', 'group')

    def create(self, validated_data):
        user = self.context.get('request').user.profile
        project = Project(**validated_data)
        project.creator = user
        project.save()
        return project


class LandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'content', 'latitude',
                  'longitude', 'markertype', 'position', 'layer')


class LandmarkImageSerializer(ModelSerializer):
    class Meta:
        model = LandmarkImage
        fields = ('id', 'landmark', 'image')


class CreateLandmarkSerializer(ModelSerializer):
    class Meta:
        model = Landmark
        fields = ('id', 'content', 'latitude',
                  'longitude', 'markertype', 'position', 'layer')


class LayerSerializer(ModelSerializer):
    class Meta:
        model = Layer
        fields = ('id', 'name', 'description')


class UserDetailsSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'email')


class UserSerializer(ModelSerializer):
    groups = GroupSerializer(many=True, required=False)

    class Meta:
        model = User
        fields = ('first_name', 'email', 'groups')


class ProfileDetailsSerializer(ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = ('id', 'department', 'user')

    def update(self, instance, validated_data):
        user = validated_data.pop('user')
        instance.department = validated_data.get(
            'department', instance.department)
        instance.save()

        # update associated user
        instance.user.first_name = user.get(
            'first_name', instance.user.first_name)
        instance.user.email = user.get('email', instance.user.email)
        instance.user.save()
        return instance
