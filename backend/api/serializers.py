from rest_framework.serializers import ModelSerializer
from api.models import Landmark

class LandmarkSerializer(ModelSerializer):

    class Meta:
        model = Landmark
        fields = ('name', 'latitude', 'longitude', 'description')