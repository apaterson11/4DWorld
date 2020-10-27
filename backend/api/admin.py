from django.contrib import admin
from api.models import Landmark

class LandmarkAdmin(admin.ModelAdmin):
    list_display = ('name', 'latitude', 'longitude', 'description')

admin.site.register(Landmark, LandmarkAdmin)