from django.contrib import admin
from api.models import Landmark


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'description')
