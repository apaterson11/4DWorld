from django.db import models

# Create your models here.
class Landmark(models.Model):
    name = models.CharField(max_length=32)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()

    def __str__(self):
        return self.name