from django.contrib.auth.models import Group, User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from api.models import City, Country, Landmark, LandmarkImage, Map, MapStyle, Profile, Project, State, Layer


class LandmarkSerializer(ModelSerializer):

    class Meta:
        model = Landmark
        fields = ('id', 'content', 'latitude',
                  'longitude', 'markertype', 'position', 'layer', 'map')


class MapStyleSerializer(ModelSerializer):
    class Meta:
        model = MapStyle
        fields = ('id', 'name', 'url', 'min_zoom', 'max_zoom', 'attribution')


class RegisterUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')

    def create(self, validated_data):
        return self.Meta.model.objects.create_user(**validated_data)


class GroupMemberSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'username')


class GroupSerializer(ModelSerializer):
    user_count = serializers.SerializerMethodField('get_user_count')
    members = GroupMemberSerializer(many=True, required=False, source='user_set')

    def get_user_count(self, obj):
        return obj.user_set.count()

    class Meta:
        model = Group
        fields = ('id', 'name', 'user_count', 'members')

class MapSerializer(ModelSerializer):
    landmarks = LandmarkSerializer(many=True, required=False)

    class Meta:
        model = Map
        fields = ('id', 'project', 'latitude', 'longitude', 'zoom', 'style', 'landmarks')


class UserProjectsSerializer(ModelSerializer):
    map = MapSerializer(required=False)

    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'creator', 'group', 'map')
    
    def create(self, validated_data):
        user = self.context.get('request').user.profile
        project = Project(**validated_data)
        project.creator = user
        project.save()
        return project


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
        fields = ('id', 'name', 'description', 'map')


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
    default_group = GroupSerializer(required=False)

    class Meta:
        model = Profile
        fields = ('id', 'department', 'user', 'default_group')

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


class CountrySerializer(ModelSerializer):
    class Meta:
        model = Country
        fields = ('id', 'name', 'country_code', 'latitude', 'longitude')


class StateSerializer(ModelSerializer):
    class Meta:
        model = State
        fields = ('id', 'name', 'country', 'state_code', 'latitude', 'longitude')


class CitySerializer(ModelSerializer):
    class Meta:
        model = City
        fields = ('id', 'name', 'country', 'state', 'latitude', 'longitude')

