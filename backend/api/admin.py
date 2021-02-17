from django.contrib import admin
from api.models import (
    City,
    Country,
    Landmark,
    Map,
    MapStyle,
    Profile,
    Project,
    State
)


@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('content', 'latitude', 'longitude')


admin.site.register(City)
admin.site.register(Country)
admin.site.register(Map)
admin.site.register(Project)
admin.site.register(Profile)
admin.site.register(State)
admin.site.register(MapStyle)
