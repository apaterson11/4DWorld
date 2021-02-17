from django.db import models
from django.contrib.auth.models import Group, User


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile'
    )
    department = models.CharField(max_length=64)

    def __str__(self):
        return self.user.username


class Project(models.Model):
    title = models.CharField(max_length=64)
    creator = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, related_name='projects', null=True
    )
    group = models.ForeignKey(
        Group, on_delete=models.SET_NULL, related_name='projects', null=True
    )

    def __str__(self):
        return self.title


class Map(models.Model):
    project = models.OneToOneField(
        Project, related_name='map', on_delete=models.CASCADE
    )
    centre_latitude = models.FloatField()
    centre_longitude = models.FloatField()
    zoom_level = models.IntegerField()

    @property
    def centre(self):
        return (self.centre_latitude, self.centre_longitude)

    def __str__(self):
        return f"Map for project {self.project.title} centred at {self.centre}"


class Landmark(models.Model):
    content = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    markertype = models.TextField(default="")
    map = models.ForeignKey(
        Map, on_delete=models.CASCADE, related_name='landmarks', null=True, blank=True
    )

    def __str__(self):
        return str(self.id)

    def save(self, *args, **kwargs):
        super(Landmark, self).save(*args, **kwargs)

class LandmarkImage(models.Model):
    #name = models.CharField(max_length=255)
    landmark = models.ForeignKey(Landmark, on_delete=models.CASCADE, related_name="landmark", parent_link = True, null=False, default=None)
    image = models.ImageField(upload_to='images/', null=False, default=None)
    #default = models.BooleanField(default=False)

    def __str__(self):
        return str(self.landmark.id)

