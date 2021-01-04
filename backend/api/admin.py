from django.contrib import admin
from api.models import (
    Landmark,
    Map,
    Profile,
    Project
)


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'description')


admin.site.register(Map)
admin.site.register(Project)
admin.site.register(Profile)
