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

const groupBy = (array, fn) =>
  array.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});

function EditMap(props) {
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
  const [map, setMap] = useState();
  const [canClick, setCanClick] = useState(false);
  const [addMarkerState, setAddMarkerState] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [addLayerPopupOpen, setAddLayerPopupOpen] = useState(false);
  const refLayerSelect = useRef();
  const refAddMarkerButton = useRef();
  const { projectID } = useParams();

  useEffect(() => {
    // get project information
    console.log("RENDERING");
    axiosInstance
      .get(`/projects/${projectID}`)
      .then((response) => {
        console.log(projectID)
        setProject(response.data);
        setViewport({
          center: [response.data.map.latitude, response.data.map.longitude],
          zoom: response.data.map.zoom,
        });
        return Promise.resolve(response.data);
      })
      .then((response) => {
        // get the landmarks
        setMap(response.map)
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

  useEffect(() => {
    if (currentLayer == null && layers.length > 0) {
      setCurrentLayer(layers[0].id);
    }
  }, [layers]);

  // function to enter into the "add marker" state and indicate to user that button is active
  const prepAddMarker = (e) => {
    setCanClick((prevState) => {
      setCanClick(!prevState);
      e.target.style.background = !prevState ? "#b8bfba" : "white";
    });
    setAddMarkerState((prevState) => {
      setAddMarkerState(!prevState);
    });
  };

  // prevents user from clicking through edit layer and add layer buttons
  const handleClick = () => {
    if (canClick == true) {
      setCanClick(false);
    }
    else if (addMarkerState == true) {
      setCanClick(true);
    }
  };

  // function adds marker to map on click via post request
  const addMarker = (e) => {
    /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
    setCanClick(false);
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
        setCanClick(true);
        rerenderParentCallback();
      });
  };

  const updateOnDelete = (newlandmarks) => setLandmarks(newlandmarks);

  // function adds new layer through "add layer" button
  const addNewLayer = (name, description) => {
    const response = axiosInstance
      .post(`/layers/`, {
        name: name,
        description: description,
        map: project.map.id,
      })
      .then((response) => {
        let newLayers = [...layers]; // copy original state
        newLayers.push(response.data); // add the new landmark to the copy
        setLayers(newLayers); // update the state with the new landmark
      });
  };

  // function deletes layer through "edit layer" function
  // const removeLayerFromState = (layer_id) => {
  //   /* Deletes the given landmark from the state, by sending a DELETE request to the API */
  //   const response = axiosInstance
  //     .delete(`/layers/${layer_id}/`)
  //     .then((response) => {
  //       // filter out the landmark that's been deleted from the state
  //       setLayers(layers.filter((layer) => layer.id !== layer_id));
  //     });
  // };

  // displays correct layers in dropdown layer select menu
  const handleLayer = (e) => {
    setCurrentLayer(e.target.value);
  };

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
            map={map}
            rerenderParentCallback={rerenderParentCallback}
            updateOnDelete={updateOnDelete}
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
          onClick={canClick ? addMarker : undefined}
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
            trigger={() => <button className="layerControl" onMouseEnter={handleClick} onMouseLeave={handleClick}>Edit Layer</button>}
            position="bottom right"
            closeOnDocumentClick

          >
            <span>
              {/* <LayerControl layers={layers} currentlayer={currentLayer} /> */}
              <LayerControl
                layers={layers}
                currentlayer={
                  state.currentlayer ? state.currentlayer : layers[0]
                }
                landmarksgrouped={groupBy([...landmarks], (i) => i.layer)}
                landmarks={landmarks}
                rerenderParentCallback={rerenderParentCallback}
              />
            </span>
          </Popup>

          {/* add layer button */}
          <Popup
            trigger={() => <button className="layerControl" onMouseEnter={handleClick} onMouseLeave={handleClick}>Add Layer</button>}
            position="bottom right"
            closeOnDocumentClick
          >
            <span>
              <LayerAdd layers={layers} addNewLayer={addNewLayer} />
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
