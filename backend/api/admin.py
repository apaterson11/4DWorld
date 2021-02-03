from django.contrib import admin
from api.models import (
    Landmark,
    Map,
    Profile,
    Project
)


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('content', 'latitude', 'longitude')


admin.site.register(Map)
admin.site.register(Project)
admin.site.register(Profile)
