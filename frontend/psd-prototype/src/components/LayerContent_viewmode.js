import React from "react";
import axiosInstance from "../axios";
import { Marker, Popup, Polygon, Circle } from "react-leaflet";
import EditMarker from "./EditMarker_viewmode";
import Polyline from "react-leaflet-arrowheads";

import {
  army,
  battle,
  blueIcon,
  city,
  disease,
  fortress,
  individual,
  industry,
  knowledge,
  religious,
  trading,
  village,
  PinkArmy,
  GreenArmy,
  node,
} from "./Icons";

const iconRef = {
  army: army,
  PinkArmy: PinkArmy,
  GreenArmy: GreenArmy,
  battle: battle,
  city: city,
  disease: disease,
  fortress: fortress,
  individual: individual,
  industry: industry,
  knowledge: knowledge,
  religious: religious,
  trading: trading,
  village: village,
  node: node,
};

// groups layer landmarks
const groupBy = (array, fn) =>
  array.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});

export class LayerContent extends React.Component {
  state = {
    landmarks: this.props.landmarks,
    layerlandmarks: this.props.layerlandmarks,
    currentlandmarks: [],
    landmarksgrouped: this.props.landmarksgrouped,
    layers: this.props.layers,
    layer: this.props.layer,
    landmark_id: this.props.landmark_id,
    content: this.props.content,
    lat: this.props.latitude,
    lng: this.props.longitude,
    icontype: this.props.markertype,
    position: this.props.position,
    map: this.props.map,
  };

  fetchData() {
    this.getLandmarks();
  }

  // refetches updated markers when they are changed
  componentDidUpdate(prevProps, prevState) {
    if (this.props.layerlandmarks && prevProps.layerlandmarks) {
      if (
        JSON.stringify(prevProps.layerlandmarks) !==
        JSON.stringify(this.props.layerlandmarks)
      ) {
        this.fetchData();
      }
    }
    // covers case where there were no markers initially
    else if (this.props.layerlandmarks) {
      this.fetchData();
    }
  }

  submitEdit = (
    layer,
    content,
    icontype,
    lat,
    lng,
    id,
    pos,
    layerlandmarks
  ) => {
    this.updateLandmarks(
      layer,
      content,
      icontype,
      lat,
      lng,
      id,
      pos,
      layerlandmarks
    );
  };

  updateLandmarks = (
    layer,
    content,
    markertype,
    lat,
    lng,
    landmark_id,
    position,
    layerlandmarks
  ) => {
    /* Updates the landmarks by sending a PUT request to the API,
           and updating the state in the then() callback
        */

    // get the current layer of the changing marker
    let oldlayer = -1;
    layerlandmarks.forEach((marker) => {
      if (marker.id == landmark_id) {
        oldlayer = marker.layer;
      }
    });

    // update position if the layer has changed
    let newposition = 0;
    let updateOldLayer = false;
    if (oldlayer !== layer) {
      let positions = [];
      let landmarksgrouped = groupBy([...this.props.landmarks], (i) => i.layer);

      if (landmarksgrouped[layer]) {
        landmarksgrouped[layer].forEach((marker) => {
          positions.push(parseInt(marker.position));
        });
        newposition = Math.max(...positions) + 1;
      }
      updateOldLayer = true;
    }

    // if just updating marker properties e.g. content and not changing layer
    else if (oldlayer == layer) {
      newposition = this.state.position;
    }

    // update marker
    const response = axiosInstance
      .put(`/landmarks/${landmark_id}/`, {
        content: content,
        markertype: markertype,
        latitude: lat,
        longitude: lng,
        layer: layer,
        position: newposition,
      })
      .then((response) => {
        let updatedLandmarks = [...this.state.landmarks]; // copy original state

        // find the index of the landmark we need to change
        let idx = updatedLandmarks.findIndex(
          (landmark) => landmark.id === landmark_id
        );

        // splice out the landmark to be changed, replacing it with the data from the API response
        updatedLandmarks.splice(idx, 1, response.data);

        // set the state with the newly updated landmark
        this.setState({ landmarks: updatedLandmarks });
      });

    // find all markers to update and send to updatePositions function
    let markersToUpdate = [];
    this.state.layerlandmarks.forEach((marker) => {
      if (marker.id != landmark_id) {
        markersToUpdate.push(marker);
      }
    });

    if (updateOldLayer) {
      this.updatePositions(markersToUpdate);
      this.setState({
        layerlandmarks: this.state.layerlandmarks.filter(
          (landmark) => landmark.id !== landmark_id
        ),
      });
      updateOldLayer = false;
    }
  };

  // updates positions of all markers after a marker's layer is changed
  updatePositions(array) {
    array.forEach((marker, index) => {
      const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
        position: index,
      });
    });
    this.getLandmarks();
  }

  // function gets all landmarks
  getLandmarks = () => {
    const results = [];
    const allmarkers = [];
    const response = axiosInstance
      .get(`/landmarks?map_id=${this.state.map.id}`, {})
      .then(
        (response) =>
          response.data.forEach((item) => {
            if (item.layer === this.state.layer) {
              results.push(item);
            }
            allmarkers.push(item);
            results.sort((a, b) => (a.position > b.position ? 1 : -1));
          }),
        this.setState(
          { layerlandmarks: results },
          this.props.rerenderParentCallback()
        )
      );

    this.setState({ landmarks: allmarkers });
    // rerender ProtoMap to display change in layers
  };

  // used for passing through to editmarker.js
  submitDelete = (id) => {
    this.removeMarkerFromState(id);
  };

  // removes landmark from state
  removeMarkerFromState = (landmark_id) => {
    /* Deletes the given landmark from the state, by sending a DELETE request to the API */

    const response = axiosInstance
      .delete(`/landmarks/${landmark_id}/`)
      .then((response) => {
        // filter out the landmark that's been deleted from the state
        this.setState({
          landmarks: this.state.landmarks.filter(
            (landmark) => landmark.id !== landmark_id
          ),
          layerlandmarks: this.state.layerlandmarks.filter(
            (landmark) => landmark.id !== landmark_id
          ),
        });
        let markersToUpdate = [...this.state.layerlandmarks];
        this.updatePositions(markersToUpdate);
        this.props.updateOnDelete(this.state.landmarks);
      });
  };

  render() {
    let layerlandmarks = this.state.layerlandmarks;

    let markers = "";
    let layercolour = "#000000";
    for (var i = 0; i < this.state.layers.length; i++) {
      if (parseInt(this.state.layers[i].id) == parseInt(this.state.layer)) {
        if (this.state.layers[i].colour) {
          layercolour = this.state.layers[i].colour;
        }
      }
    }

    if (this.state.layerlandmarks) {
      // if there are any markers in this layer, show all markers
      markers = layerlandmarks.map((landmark, index) => (
        <Marker
          key={landmark.id}
          position={[landmark.latitude, landmark.longitude]}
          icon={landmark.markertype in iconRef ? iconRef[landmark.markertype] : blueIcon}
          // if a markertype is chosen, show that icon, otherwise show a default blue marker
        >
          <Popup
            autoClose={false}
            nametag={"marker"}
            minWidth={400}
            maxWidth={2000}
          >
            <React.Fragment>
              {/* EditMarker is the popup attached to each landmark */}
              <EditMarker
                landmarks={this.state.landmarks}
                layerlandmarks={this.state.layerlandmarks}
                content={landmark.content}
                position={landmark.position}
                icontype={landmark.markertype}
                lat={landmark.latitude}
                lng={landmark.longitude}
                id={landmark.id}
                layer={this.state.layer}
                layers={this.state.layers}
                uuid={this.props.uuid}
              ></EditMarker>
            </React.Fragment>
          </Popup>
        </Marker>
      ));

      // determine the type of this layer to determine the content to show

      let layertype = "";

      for (var i = 0; i < this.state.layers.length; i++) {
        if (this.state.layers[i].id == this.state.layer) {
          layertype = this.state.layers[i].type;
        }
      }

      let content = "";

      // make copies of landmarks array
      let fromLandmarks = [...this.state.layerlandmarks];
      let toLandmarks = [...this.state.layerlandmarks];

      fromLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));
      fromLandmarks.pop();
      toLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));
      toLandmarks = toLandmarks.slice(1);
      // fromLandmarks = [marker 1, marker 2, ... marker n-1]
      // toLandmarks = [marker 2, marker 3, ..., marker n]
      // this creates one line betweem every pair of markers

      if (layertype == "NDR") {
        // display lines with no arrows (non-directional)
        // range(length of fromLandmarks)
        let range = Array(fromLandmarks.length)
          .fill()
          .map((x, i) => i);

        content = range.map((i) => (
          <Polyline
            key={fromLandmarks.id}
            positions={[
              [fromLandmarks[i].latitude, fromLandmarks[i].longitude],
              [toLandmarks[i].latitude, toLandmarks[i].longitude],
            ]}
            color={layercolour}
          />
        ));
      } else if (layertype == "FIL") {
       // display an area fill (shaded polygon) between all markers

        let fillLandmarks = [...this.state.layerlandmarks];

        fillLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));
        // sorts array of all landmarks by position

        let range2 = Array(fillLandmarks.length)
          .fill()
          .map((x, i) => i);
        let positions = range2.map((i) => [
          fillLandmarks[i].latitude,
          fillLandmarks[i].longitude,
        ]);
        // positions = array of all marker [lat, long]s

        content = <Polygon color={layercolour} positions={positions} />;
      } else if (layertype == "DIR") {
       // display lines with arrowheads (directional)
        let rangeDIR = Array(fromLandmarks.length)
          .fill()
          .map((x, i) => i);

        content = rangeDIR.map((i) => (
          <Polyline
            key={fromLandmarks.id}
            positions={[
              [fromLandmarks[i].latitude, fromLandmarks[i].longitude],
              [toLandmarks[i].latitude, toLandmarks[i].longitude],
            ]}
            color={layercolour}
            arrowheads={{ size: "12px", frequency: "50px" }}
          />
        ));
      }

      return (
        <React.Fragment>
          {markers}
          {content}
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default LayerContent;
