from django.urls import path
from rest_framework.routers import DefaultRouter
from api.views import BlacklistTokenUpdateView, UserRegisterView, LandmarkAPIView

router = DefaultRouter()
router.register('landmarks', LandmarkAPIView, basename='landmarks')
# router.register('register', UserRegisterView, basename='register')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='register'),
    path('logout/blacklist/', BlacklistTokenUpdateView.as_view(), name='blacklist')
]

urlpatterns += router.urls
