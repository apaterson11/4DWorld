from rest_framework.routers import DefaultRouter
from api.views import LandmarkAPIView

router = DefaultRouter()
router.register('landmarks', LandmarkAPIView, basename='landmarks')

urlpatterns = router.urls