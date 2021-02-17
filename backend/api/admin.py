from django.contrib import admin
from api.models import (
    Landmark,
    LandmarkImage,
    Map,
    Profile,
    Project
)

class LandmarkImageAdmin(admin.StackedInline):
    model = LandmarkImage

@admin.register(Landmark)
class LandmarkAdmin(admin.ModelAdmin):
    inlines = [LandmarkImageAdmin]
    list_display = ('content', 'latitude', 'longitude')

@admin.register(LandmarkImage)
class LandmarkImageAdmin(admin.ModelAdmin):
    pass

admin.site.register(Map)
admin.site.register(Project)
admin.site.register(Profile)
