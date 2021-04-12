from django.core.management.base import BaseCommand

from api.models import MapStyle


class Command(BaseCommand):
    help = 'Add map styles to database'

    def handle(self, *args, **options):

        # Map style options; reference: https://leaflet-extras.github.io/leaflet-providers/preview/
        MAP_OPTIONS = [
               {
                'name': 'OpenStreetMap: Mapnik (Default)',
                'url': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'OpenStreetMap: HOT',
                'url': 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
            },
            {
                'name': 'OpenStreetMap: TopoMap',
                'url': 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 17,
                'attribution': 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            },
            {
                'name': 'Stadia: AlidadeSmoothDark',
                'url': 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: Terrain',
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 16,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Esri: WorldImagery',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            },
            {
                'name': 'Esri: OceanBasemap',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 10,
                'attribution': 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
            },
            {
                'name': 'Esri: NatGeoWorldMap',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 12,
                'attribution': 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC'
            },
            {
                'name': 'CartoDB: Positron',
                'url': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'CartoDB: DarkMatter',
                'url': 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }
        ]

        styles = []
        for style in MAP_OPTIONS:
            styles.append(MapStyle(
                name=style['name'], 
                url=style['url'],
                min_zoom=style['min_zoom'],
                max_zoom=style['max_zoom'],
                attribution=style['attribution']
            ))

        MapStyle.objects.bulk_create(styles)
        self.stdout.write(self.style.SUCCESS('Map styles added to the database.'))