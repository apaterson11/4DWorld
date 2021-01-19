from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import BlacklistTokenUpdateView, UserRegisterView, LandmarkAPIView
from api.views_ajax import check_email, check_username

router = DefaultRouter()
router.register('landmarks', LandmarkAPIView, basename='landmarks')
# router.register('register', UserRegisterView, basename='register')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]

ajax_urls = [
    path('ajax/check_email/', check_email, name='ajax-check-email'),
    path('ajax/check_username/', check_username, name='ajax-check-username')
]

urlpatterns += router.urls + ajax_urls
