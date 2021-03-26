import React from "react";
import { Map, TileLayer } from "react-leaflet";
import opacity from '../opacity.png'
import { IsAuthenticated } from "../Context";

require("./About.css");

const DEFAULT_VIEWPORT = {
  center: [55.86515, -4.25763], // needs to be changed to values defined in project creation
  zoom: 13,
};

class HomeMap extends React.Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
  };

  constructor(props) {
    super(props)
  }

  render() {
    let goButton = ''
    console.log(this.props)
    if (this.props.IsAuthenticated) {
      goButton = <a href="/dashboard/" className="btn">Dashboard</a>
    }
    else {
      goButton = <a href="/login/" className="btn">Login</a>
    }
    return (
      <Map
          center={[50, -40]}
          zoom={4}
          maxBounds={[
            [90, -180],
            [-90, 180],
          ]}
        >
        <div className="title">
          <h1>4DWorld</h1>
          <h3>Not much to see here... go get started!</h3>
          {goButton}
        </div>
      <TileLayer 
        url={opacity}
        minZoom={3}
        maxZoom={18}
        noWrap={true}
        zIndex={1}>
      </TileLayer>
      <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            minZoom={3}
            maxZoom={18}
            noWrap={true}
            zIndex={0}
          />
      </Map>
    )
  }
}

export default HomeMap;
