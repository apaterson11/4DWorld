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
                'name': 'Stadia: AlidadeSmooth',
                'url': 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stadia: AlidadeSmoothDark',
                'url': 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stadia: OSMBright',
                'url': 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stadia: Outdoors', 
                'url': 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            {
                'name': 'CyclOSM',
                'url': 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: Toner',
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: TonerBackground',
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: TonerLite', 
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: Watercolor',
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 16,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Stamen: Terrain',
                'url': 'https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 16,
                'attribution': 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            {
                'name': 'Esri: WorldStreetMap',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            },
            {
                'name': 'Esri: DeLorme',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 11,
                'attribution': 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            },
            {
                'name': 'Esri: WorldTopoMap',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
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
                'name': 'Esri: WorldGrayCanvas',
                'url': 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                'min_zoom': 1,
                'max_zoom': 16,
                'attribution': 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
            },
            {
                'name': 'CartoDB: Positron',
                'url': 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'CartoDB: PositronNoLabels',
                'url': 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
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
            },
            {
                'name': 'CartoDB: DarkMatterNoLabels', 
                'url': 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'CartoDB: Voyager',
                'url': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'CartoDB: VoyagerNoLabels', 
                'url': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'CartoDB: VoyagerLabelsUnder',
                'url': 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            },
            {
                'name': 'HikeBike: HikeBike',
                'url': 'https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png',
                'min_zoom': 1,
                'max_zoom': 19,
                'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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