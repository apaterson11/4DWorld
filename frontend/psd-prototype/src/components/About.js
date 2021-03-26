import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Map, TileLayer, Marker, Polygon } from "react-leaflet";
import L from 'leaflet';
import TextCard from "./TextCard";
import Footer from "./Footer";
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
          <h1>4DWorld</h1>
          <h3>Not much to see here... go get started!</h3>
        </div>
      <TileLayer 
        url="https://img2.pngio.com/opacity-png-png-image-opacity-png-1920_1280.png"
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
