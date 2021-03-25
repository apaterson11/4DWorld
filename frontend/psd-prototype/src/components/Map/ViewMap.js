import React, { useEffect, useState } from "react";
import { Map, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import Spinner from "../Spinner";

function ViewMap(props) {
  const [viewport, setViewport] = useState();
  const [project, setProject] = useState();
  const [mapStyle, setMapStyle] = useState();
  const [landmarks, setLandmarks] = useState();
  const [layers, setLayers] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { projectID } = useParams();

  useEffect(() => {
    // get project information
    axiosInstance
      .get(`/projects/${projectID}`)
      .then((response) => {
        setProject(response.data);
        setViewport({
          center: [response.data.map.latitude, response.data.map.longitude],
          zoom: response.data.map.zoom,
        });
        return Promise.resolve(response.data);
      })
      .then((response) => {
        // get the landmarks, layers and map style
        const landmarkRequest = axiosInstance.get(
          `/landmarks?map_id=${response.map.id}`
        );
        const layerRequest = axiosInstance.get(
          `/layers?map_id=${response.map.id}`
        );
        const mapStyleRequest = axiosInstance.get(
          `/map-styles/${response.map.style}`
        );

        Promise.all([landmarkRequest, layerRequest, mapStyleRequest]).then(
          (response) => {
            setLandmarks(response[0].data);
            setLayers(response[1].data);
            setMapStyle(response[2].data);
            setFetching(false);
          }
        );
      });
  }, []);

  return (
    <React.Fragment>
      {fetching ? (
        <Spinner />
      ) : (
        <Map
          viewport={viewport}
          maxBounds={[
            [90, -180],
            [-90, 180],
          ]}
        >
          <TileLayer
            url={mapStyle.url}
            minZoom={mapStyle.min_zoom}
            maxZoom={mapStyle.max_zoom}
            noWrap={true}
          />

          {/* toggle layer visibility menu */}
          {/* <LayersControl position="topright">{renderlayers}</LayersControl> */}
        </Map>
      )}
    </React.Fragment>
  );
}

export default ViewMap;
