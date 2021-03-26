from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Landmark, Layer, Map, Project

class UUIDAccess(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return True
        if request.method == 'GET':
            uuid = request.GET.get('uuid')
            if uuid is None:
                return False

            proj_id = view.kwargs.get('pk')
            map_id = request.GET.get('map_id')
            if proj_id:
                try:
                    project = Project.objects.get(pk=proj_id)
                    if str(project.hash_field) == uuid:
                        return True
                except Project.DoesNotExist:
                    return False
            elif map_id is not None:
                map = Map.objects.get(id=map_id)
                hash_field = str(map.project.hash_field)
                if hash_field == uuid:
                    return True

        return False
            
