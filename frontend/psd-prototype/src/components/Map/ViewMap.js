import React, { useState, useRef, useEffect, useContext } from "react";
import { Map, TileLayer, LayersControl, LayerGroup } from "react-leaflet";
import { useParams, useHistory } from "react-router-dom";
import Control from "@skyeer/react-leaflet-custom-control";
import axiosInstance from "../../axios";
import { LayerContent } from "../LayerContent_viewmode";
import Popup from "reactjs-popup";
import LayerControl from "../LayerControl";
import LayerAdd from "../LayerAdd";
import Spinner from "../Spinner";

require("../LayerControl.css");
require("../ProtoMap.css");

const groupBy = (array, fn) =>
  array.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});

function ViewMap(props) {
  const [state, setState] = useState({
    markertype: "default",
    layerlandmarks: [],
    layer_name: "",
    layer_desc: "",
  });
  const [viewport, setViewport] = useState();
  const [project, setProject] = useState();
  const [landmarks, setLandmarks] = useState();
  const [layers, setLayers] = useState([]);
  const [mapStyle, setMapStyle] = useState();
  const [canClick, setCanClick] = useState(false);
  const [addMarkerState, setAddMarkerState] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [addLayerPopupOpen, setAddLayerPopupOpen] = useState(false);
  const refLayerSelect = useRef();
  const refAddMarkerButton = useRef();
  const { projectID } = useParams();
  const history = useHistory();

  useEffect(() => {
    // get project information
    console.log("RENDERING");
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
        // get the landmarks
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
      })
      .catch((err) => {
        history.push("/login");
      });
  }, []);

  useEffect(() => {
    if (currentLayer == null && layers.length > 0) {
      setCurrentLayer(layers[0].id);
    }
  }, [layers]);

  const rerenderParentCallback = () => {
    const landmarkRequest = axiosInstance.get(
      `/landmarks?map_id=${project.map.id}`
    );
    const layerRequest = axiosInstance.get(`/layers?map_id=${project.map.id}`);

    Promise.all([landmarkRequest, layerRequest]).then((response) => {
      setLandmarks(response[0].data);
      setLayers(response[1].data);
      setFetching(false);
    });

    // axiosInstance.get("/landmarks/").then((response) => {
    //   setLandmarks(response.data);

    //   axiosInstance.get("/layers/").then((response) => {
    //     setLayers(response.data);
    //     setFetching(false);
    //   });
    // });
    // forceUpdate();
  };

  // toggle layer visibility menu
  const renderlayers = layers.map((e, key) => {
    return (
      <LayersControl.Overlay key={e.id} checked name={e.name}>
        <LayerGroup>
          <LayerContent
            key={e.id}
            layer={e.id}
            landmark_id={state.id}
            landmarksgrouped={groupBy([...landmarks], (i) => i.layer)}
            layerlandmarks={groupBy([...landmarks], (i) => i.layer)[e.id]}
            content={state.content}
            latitude={project.map.latitude}
            longitude={project.map.longitude}
            markertype={state.markertype}
            position={state.position}
            layers={layers}
            landmarks={landmarks}
            rerenderParentCallback={rerenderParentCallback}
          ></LayerContent>
        </LayerGroup>
      </LayersControl.Overlay>
    );
  });

  return (
    <React.Fragment>
      {fetching ? (
        <Spinner />
      ) : (
        <Map
          // onViewportChanged={onViewportChanged}
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
          <LayersControl position="topright">{renderlayers}</LayersControl>

          {/* reset view button - will this ever be fixed? only time will tell */}
          {/* <Control position="bottomright">
        <button className="btn-resetview" onClick={createLines}>
          Reset View
        </button>
      </Control> */}
        </Map>
      )}
    </React.Fragment>
  );
}

export default ViewMap;
