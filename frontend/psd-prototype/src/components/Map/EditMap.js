import React, { useState, useRef, useEffect, useContext } from "react";
import { Map, TileLayer, LayersControl, LayerGroup } from "react-leaflet";
import { useParams } from "react-router-dom";
import Control from "@skyeer/react-leaflet-custom-control";
import axiosInstance from "../../axios";
import { LayerContent } from "../LayerContent";
import Popup from "reactjs-popup";
import LayerControl from "../LayerControl";
import LayerAdd from "../LayerAdd";
import Spinner from "../Spinner";

require("../LayerControl.css");
require("../ProtoMap.css");

const DEFAULT_VIEWPORT = {
  center: [55.86515, -4.25763],
  zoom: 13,
};

function EditMap(props) {
  const [state, setState] = useState({
    fetched: false,
    viewport: DEFAULT_VIEWPORT,
    markertype: "default",
    layerlandmarks: [],
    layer_name: "",
    layer_desc: "",
  });
  const [project, setProject] = useState();
  const [landmarks, setLandmarks] = useState();
  const [layers, setLayers] = useState([]);
  const [canClick, setCanClick] = useState(false);
  const [currentLayer, setCurrentLayer] = useState();
  const [fetching, setFetching] = useState(false);
  const refLayerSelect = useRef();
  const refAddMarkerButton = useRef();
  const { projectID } = useParams();

  useEffect(() => {
    setFetching(true);
    // get project information
    axiosInstance
      .get(`/projects/${projectID}`)
      .then((response) => {
        setProject(response.data);
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

        Promise.all([landmarkRequest, layerRequest]).then((response) => {
          setLandmarks(response[0].data);
          setLayers(response[1].data);
          setFetching(false);
        });
      });
  }, []);

  // function to enter into the "add marker" state and indicate to user that button is active
  const prepAddMarker = (e) => {
    setCanClick(!canClick);
    e.target.style.background = canClick ? "#b8bfba" : "white";
  };

  // function adds marker to map on click via post request
  const addMarker = (e) => {
    refLayerSelect.current.focus(); // get current layer

    /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
    const { lat, lng } = e.latlng;
    const pos = landmarks.length;
    const response = axiosInstance
      .post("/landmarks/", {
        layer: currentLayer,
        content: "sample text",
        latitude: lat,
        longitude: lng,
        markertype: "default",
        position: pos,
        map: project.map.id,
      })
      .then((response) => {
        let newLandmarks = [...landmarks]; // copy original state
        newLandmarks.push(response.data); // add the new landmark to the copy
        setLandmarks(newLandmarks); // update the state with the new landmark
      });
  };

  // function adds new layer through "add layer" button
  const addLayer = () => {
    const response = axiosInstance
      .post(`/layers/`, {
        name: state.layer_name,
        description: state.layer_desc,
      })
      .then((response) => {
        let newLayers = [...layers]; // copy original state
        newLayers.push(response.data); // add the new landmark to the copy
        setLayers(newLayers); // update the state with the new landmark
      });
  };

  // function deletes layer through "edit layer" function
  const removeLayerFromState = (layer_id) => {
    /* Deletes the given landmark from the state, by sending a DELETE request to the API */
    const response = axiosInstance
      .delete(`/layers/${layer_id}/`)
      .then((response) => {
        // filter out the landmark that's been deleted from the state
        setLayers(layers.filter((layer) => layer.id !== layer_id));
      });
  };

  // displays correct layers in dropdown layer select menu
  const handleLayer = (e) => {
    setCurrentLayer(e.target.value);
  };

  // toggle layer visibility menu
  const renderlayers = layers.map((e, key) => (
    <LayersControl.Overlay key={e.id} checked name={e.name}>
      <LayerGroup>
        <LayerContent
          layer={e.id}
          landmark_id={state.id}
          layerlandmarks={state.layerlandmarks}
          content={state.content}
          latitude={props.latitude}
          longitude={props.longitude}
          markertype={state.markertype}
          position={state.position}
          layers={layers}
          landmarks={landmarks}
        ></LayerContent>
      </LayerGroup>
    </LayersControl.Overlay>
  ));

  return (
    <React.Fragment>
      {fetching ? (
        <Spinner />
      ) : (
        <Map
          // onViewportChanged={onViewportChanged}
          viewport={state.viewport}
          center={[props.latitude, props.longitude]}
          onClick={canClick ? addMarker : undefined}
          zoom={4}
          maxBounds={[
            [90, -180],
            [-90, 180],
          ]}
        >
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            minZoom={1}
            maxZoom={18}
            noWrap={true}
          />

          {/* toggle layer visibility menu */}
          <LayersControl position="topright">{renderlayers}</LayersControl>

          {/* select layer dropdown menu */}
          <Control position="topright">
            <React.Fragment>
              <select
                value={currentLayer}
                onFocus={handleLayer}
                onChange={handleLayer}
                ref={refLayerSelect}
              >
                {layers.map((e, key) => {
                  console.log(e);
                  return (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  );
                })}
              </select>
            </React.Fragment>
          </Control>

          {/* edit layer button */}
          <Popup
            trigger={() => <button className="layerControl">Edit Layer</button>}
            position="bottom right"
            closeOnDocumentClick
          >
            <span>
              <LayerControl layers={layers} currentlayer={currentLayer} />
            </span>
          </Popup>

          {/* add layer button */}
          <Popup
            trigger={() => <button className="layerControl">Add Layer</button>}
            position="bottom right"
          >
            <span>
              <LayerAdd layers={layers} />
            </span>
          </Popup>

          {/* add marker button */}
          <Control position="topright">
            <button
              className="btn-addMarker"
              onClick={prepAddMarker}
              ref={refAddMarkerButton}
            >
              Add Marker
            </button>
          </Control>

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

export default EditMap;
