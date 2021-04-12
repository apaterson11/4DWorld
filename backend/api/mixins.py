from rest_framework.response import Response
from api.models import Project

class FilterByMapMixin:
    """ Provides an override of the list() method of ModelViewSet
        This can filter the given list by the map ID provided by a query param.
        For example: used with Landmarks to only get landmarks associated with a given map
    """
    def list(self, request, *args, **kwargs):
        map_id = self.request.GET.get('map_id')
        if map_id is not None:
            qs = self.get_queryset().filter(map=map_id)
            data = self.serializer_class(qs, many=True).data
            return Response(data, 200)
        return super().list(request, *args, **kwargs)

