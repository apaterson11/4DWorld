from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import BlacklistTokenUpdateView, ProjectAPIView, UserRegisterView, LandmarkAPIView
from api.views_ajax import check_email, check_username

router = DefaultRouter()
router.register('landmarks', LandmarkAPIView, basename='landmarks')
router.register('projects', ProjectAPIView, basename='projects')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]

ajax_urls = [
    path('ajax/check_email/', check_email, name='ajax-check-email'),
    path('ajax/check_username/', check_username, name='ajax-check-username')
]

urlpatterns += router.urls + ajax_urls
