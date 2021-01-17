from django.db import models
from django.contrib.auth.models import User


class Profile(User):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='userprofile'
    )


class Landmark(models.Model):
    name = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        super(Landmark, self).save(*args, **kwargs)