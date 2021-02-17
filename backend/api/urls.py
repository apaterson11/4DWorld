from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import (
    BlacklistTokenUpdateView,
    CityAPIView,
    CountryAPIView,
    GroupAPIView, 
    LandmarkAPIView,
    MapAPIView,
    MapStylesAPIView,
    ProjectAPIView,
    StateAPIView,
    UserDetailsAPIView,
    UserRegisterView
)
from api.views_ajax import check_email, check_username

router = DefaultRouter()
router.register('landmarks', LandmarkAPIView, basename='landmarks')
router.register('projects', ProjectAPIView, basename='projects')
router.register('user-details', UserDetailsAPIView, basename='user-details')
router.register('groups', GroupAPIView, basename='groups')
router.register('countries', CountryAPIView, basename='countries')
router.register('states', StateAPIView, basename='states')
router.register('cities', CityAPIView, basename='cities')
router.register('map-styles', MapStylesAPIView, basename='map-styles')
router.register('maps', MapAPIView, basename='maps')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]

ajax_urls = [
    path('ajax/check_email/', check_email, name='ajax-check-email'),
    path('ajax/check_username/', check_username, name='ajax-check-username')
]

urlpatterns += router.urls + ajax_urls
