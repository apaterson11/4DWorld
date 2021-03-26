import React from "react";
import axiosInstance from "../axios";
import { Marker, Popup, Polygon, Circle } from "react-leaflet";
import EditMarker from "./EditMarker";
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
  node
} from "./Icons";
// S
// import { Polygon } from 'leaflet';

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
  node: node
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

  // fetches all markers when page is loaded
//   componentDidMount() {
//     this.fetchData();
//     console.log("this.state.layer", this.state.layer);
//   }

  fetchData() {
    console.log("fetch data")
    this.getLandmarks();
  }

  componentDidMount() {
    this.fetchData();
  }

  // refetches updated markers when they are changed
  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.layerlandmarks)
    console.log(this.props.layerlandmarks)
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

  submitEdit = (layer,content,icontype,lat,lng,id,pos,layerlandmarks) => {
    this.updateLandmarks(layer,content,icontype,lat,lng,id,pos,layerlandmarks);
  };

  updateLandmarks = (layer,content,markertype,lat,lng,landmark_id,position,layerlandmarks) => {
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
        else {
          this.props.rerenderParentCallback()
        }
      });
    
  };

  // updates positions of all markers after a marker's layer is changed
  updatePositions(array) {
        array.forEach((marker, index) => {
          if (index == (array.length-1)) {
            const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
              position: index,
            }).then(() => {
              this.getLandmarks()
            })
          }
        const response = axiosInstance.patch(`/landmarks/${marker.id}/`, {
            position: index,
          })
        });
  }

  // function gets all landmarks
  getLandmarks = () => {
    const results = [];
    const allmarkers = [];
    const response = axiosInstance.get(`/landmarks?map_id=${this.state.map.id}`, {}).then(
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
          icon={
            landmark.markertype in iconRef
              ? iconRef[landmark.markertype]
              : blueIcon
          }
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
                markerEdit={this.submitEdit}
                markerDelete={this.submitDelete}
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

      // console.log(this.state.layer, layertype)
      // make copies of landmarks array
      let fromLandmarks = [...this.state.layerlandmarks];
      let toLandmarks = [...this.state.layerlandmarks];

      fromLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));
      fromLandmarks.pop();
      toLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));
      toLandmarks = toLandmarks.slice(1);

      if (layertype == "NDR") {
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
        // creates one line between each pair of markers
      } else if (layertype == "FIL") {
        // console.log("is FIL")
        let fillLandmarks = [...this.state.layerlandmarks];

        fillLandmarks.sort((a, b) => (a.position > b.position ? 1 : -1));

        let range2 = Array(fillLandmarks.length)
          .fill()
          .map((x, i) => i);

        let positions = range2.map((i) => [
          fillLandmarks[i].latitude,
          fillLandmarks[i].longitude,
        ]);

        let testcenter = positions[1];
        let test = "";
        let test2 = "";
        content = <Polygon color={layercolour} positions={positions} />;
      } else if (layertype == "DIR") {
        //Range (length of fromlandmarks)
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
        )); //Add arrows to the polylines between markers
      }
      // test2 = <Circle color={'purple'} center={[54, -4]} radius={1000000}/>
      // const fillcolour = {color: 'blue'}

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
