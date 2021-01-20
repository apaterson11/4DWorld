import React, { Component, useEffect, useState, useRef, useMemo, useCallback } from "react";
import {Map, TileLayer, Marker} from 'react-leaflet';
// import Control from 'react-leaflet-control';
import Control from '@skyeer/react-leaflet-custom-control'
import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { marker } from "leaflet";

const DEFAULT_VIEWPORT = {
  center: [51.505, -0.09],
  zoom: 13,
}


class JustMap extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
  }

  handleClick = () => {
    this.setState({ viewport: DEFAULT_VIEWPORT })
  }

  onViewportChanged = viewport => {
    this.setState({ viewport })
  }

  render() {
    return (
      <div>
        <h1>React-Leaflet-Custom-Control example</h1>
        <Map onViewportChanged={this.onViewportChanged} viewport={this.state.viewport}>
          <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          <Control position="bottomright">
            <button onClick={this.handleClick}>Reset View</button>
          </Control>
        </Map>
      </div>
    )
  }
}

export default JustMap;