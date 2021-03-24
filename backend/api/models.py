from django.db import models
from django.db.models.functions import Lower
from django.contrib.auth.models import Group, User


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile'
    )
    department = models.CharField(max_length=64)
    default_group = models.ForeignKey(Group, on_delete=models.PROTECT)

    def __str__(self):
        return self.user.username


class Project(models.Model):
    title = models.CharField(max_length=64)
    description = models.TextField(blank=True, default='')
    creator = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, related_name='projects', null=True
    )
    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, related_name='projects', null=True
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = (Lower('title'),)


class MapStyle(models.Model):
    name = models.CharField(max_length=64, db_index=True)
    url = models.CharField(max_length=128)
    min_zoom = models.IntegerField()
    max_zoom = models.IntegerField()
    attribution = models.CharField(max_length=128)

    def __str__(self):
        return self.name


def get_default_style():
    return MapStyle.objects.get(name='OpenStreetMap: Mapnik (Default)')


class Map(models.Model):
    project = models.OneToOneField(
        Project, related_name='map', on_delete=models.CASCADE
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    zoom = models.FloatField()
    style = models.ForeignKey(
        MapStyle, on_delete=models.SET(get_default_style), related_name='maps'
    )

    @property
    def centre(self):
        return (self.latitude, self.longitude)

    def __str__(self):
        return f"Map for project {self.project.title} centred at {self.centre}"


class Layer(models.Model):
    name = models.TextField(default="")
    description = models.TextField(default="")
    map = models.ForeignKey(Map, on_delete=models.CASCADE, null=True, blank=True)  # should not be nullable later on
    colour = models.TextField(default="#000000")

    DIRECTIONAL = 'DIR'
    FILL = 'FIL'
    NON_DIRECTIONAL = 'NDR'
    type_choices = [(DIRECTIONAL, 'Directional'), (FILL, 'Fill'),
                    (NON_DIRECTIONAL, 'Non-directional')]
    type = models.TextField(default=NON_DIRECTIONAL, choices=type_choices)

    def __str__(self):
        return str(self.id)


class Landmark(models.Model):
    content = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    markertype = models.TextField(default="")
    position = models.IntegerField(default=-1)
    layer = models.ForeignKey(
        Layer, on_delete=models.CASCADE, related_name="layer", null=True, default=1)
    map = models.ForeignKey(
        Map, on_delete=models.CASCADE, related_name='landmarks', null=True, blank=True
    )

    def __str__(self):
        return str(self.id)


class LandmarkImage(models.Model):
    landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE,
                                 related_name="landmark", parent_link=True, null=False, default=None)
    image = models.ImageField(max_length=1000, upload_to='images/', null=False, default=None)
    image_name = models.CharField(default="", max_length=1000)

    def __str__(self):
        return str(self.landmark.id)


class Country(models.Model):
    name = models.CharField(max_length=64)
    country_code = models.CharField(max_length=2, db_index=True)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    class Meta:
        verbose_name_plural = 'Countries'

    def __str__(self):
        return self.name


class State(models.Model):
    name = models.CharField(max_length=64, db_index=True)
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, related_name='states', null=True
    )
    state_code = models.CharField(max_length=3, db_index=True)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    def __str__(self):
        return self.name


class City(models.Model):
    name = models.CharField(max_length=64, db_index=True)
    country = models.ForeignKey(
        Country, on_delete=models.SET_NULL, related_name='cities', null=True
    )
    state = models.ForeignKey(
        State, on_delete=models.SET_NULL, related_name='cities', null=True
    )
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    class Meta:
        verbose_name_plural = 'Cities'

    def __str__(self):
        return self.name
