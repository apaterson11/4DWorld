import React, { useContext, useEffect } from "react";
import { Map, TileLayer } from "react-leaflet";
import opacity from "../opacity.png";
import { IsAuthenticated, UserContext } from "../Context";
import { Link } from "react-router-dom";

require("./About.css");

// displays the homepage
function HomeMap() {
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(IsAuthenticated);

  // checks if the user is logged in
  useEffect(() => {
    if (userDetails === undefined) {
      const details = JSON.parse(localStorage.getItem("userDetails"));
      if (!details) {
        setIsAuthenticated(false);
      } else {
        setUserDetails(details);
        setIsAuthenticated(true);
      }
    }
  }, [userDetails]);

  return (
    // semi-interactive map on homepage
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
        {/* if the user is logged in, home page button goes to dashboard, otherwise a login page */}
        {isAuthenticated ? (
          <Link to="/dashboard/" className="btn">
            Dashboard
          </Link>
        ) : (
          <Link to="/login/" className="btn">
            Login
          </Link>
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

export default HomeMap;
