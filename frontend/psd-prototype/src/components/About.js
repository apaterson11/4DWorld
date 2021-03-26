import React from "react";
import { Map, TileLayer } from "react-leaflet";
import opacity from "../opacity.png";
import { IsAuthenticated } from "../Context";

require("./About.css");

const DEFAULT_VIEWPORT = {
  center: [55.86515, -4.25763], // needs to be changed to values defined in project creation
  zoom: 13,
};

class HomeMap extends React.Component {
  static contextType = IsAuthenticated;
  state = {
    viewport: DEFAULT_VIEWPORT,
    isAuthenticated: this.context.isAuthenticated,
  };

  render() {
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
          <h1 className="titleh1">4DWorld</h1>
          <h3 className="titleh3">Not much to see here... go get started!</h3>
          {this.state.isAuthenticated ? (
            <a href="/dashboard/" className="btn">
              Dashboard
            </a>
          ) : (
            <a href="/login/" className="btn">
              Login
            </a>
          )}
        </div>
        <TileLayer
          url={opacity}
          minZoom={3}
          maxZoom={18}
          noWrap={true}
          zIndex={1}
        ></TileLayer>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          minZoom={3}
          maxZoom={18}
          noWrap={true}
          zIndex={0}
        />
      </Map>
    );
  }
}

export default HomeMap;
