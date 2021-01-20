import React, { Component, useEffect, useState, useRef, useMemo, useCallback } from "react";
import {Map, TileLayer, Marker} from 'react-leaflet';
// import JustMap from './components/JustMap';

import Control from '@skyeer/react-leaflet-custom-control'
import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { marker } from "leaflet";

const DEFAULT_VIEWPORT = {
    center: [55.86515, -4.25763],
    zoom: 13,
  }

class ProtoMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            mapRef: null,
            markers: [],
            name: "",
            defLat: this.props.latitude,
            defLng: this.props.longitude,
            test: false,
            viewport: DEFAULT_VIEWPORT
        };
    }


      handleClick = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
      }
    
      onViewportChanged = viewport => {
        this.setState({ viewport })
      }


    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.markers.length !== nextState.markers.length) {
            return true;
        }
        else {
            if (this.state.markers !== nextState.markers) {
                return false;
            }
            else {
                return true;
            }
        }
    }
    
    removeMarkerFromState = (index) => {
        
        //const { mapRef } = this.state;
        //mapRef.current.leafletElement.closePopup()

        // Create a new array identical to the old one, and modify it - immutability!
        const newMarkers = [...this.state.markers]
        newMarkers.splice(index, 1)
    
        // ...and save to state
        this.setState({
            markers: newMarkers
        });
      };
    
    saveContentToState = (content, position, index) => {
          const newMarkers = this.state.markers.map( (marker, i) => {
             if (i === index) {
                return {
                   ...marker,
                   popupContent: content,
                }
             } else {
                return marker;
             }
          });
    
          this.setState({
             markers: newMarkers
          });

          console.log(position)

          const {name} = 'lol'
          const { latitude, longitude } = position;
          const {description} = content

          const response = fetch('http://127.0.0.1:8000/api/landmarks.json',
        {
            method: 'POST',
            mode:'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                name,
                latitude,
                longitude,
                description
            }
        }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
      };

    componentDidMount() {
        const url = 'http://127.0.0.1:8000/api/landmarks.json'
        fetch(url).then(response => response.json())
                  .then(r => this.setState({landmarks: r, fetched: true}))
    }

    addMarker = (e) => {
        const {markers} = this.state
        markers.push(e.latlng)
        const { lat, lng } = e.latlng;
        console.log(lat)
        this.setState({markers})
        //const {name}='lol';
        //const {desc}='ah';

        /*
        //broken
        const {markers} = this.state
        //markers.push(e.latlng)
        this.setState({
            markers: [
                ...this.state.markers,
                {
                    coords: e.latlng,
                    popupContent: 'skkrt skkrt',
                    open: false,
                    autoClose: false
                },
            ],
        });*/
    };


// const center = [51.505, -0.09]
// const zoom = 13


    render() {
        const markerText = {
            popupContent: '<h2>sample text</h2>sample text',
            open: false,
            autoClose: true,
        }

        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let new_content = ''
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={uuidv4()} position={[landmark.latitude, landmark.longitude]}>
                    <Popup 
                    autoClose={false} 
                    nametag={'marker'} 
                    editable removable 
                    removalCallback={ () => {this.removeMarkerFromState(index)} }
                    saveContentCallback={ content => {this.saveContentToState(content, landmark.latitude, landmark.longitude, index)} }
                    >
                        {landmark.name}
                    </Popup>
                </Marker>)
            
            new_content = this.state.markers.map((position, index) =>
                <Marker key = {uuidv4()} position={position} name={markerText.popupContent}>
                    <Popup
                    autoClose={false} 
                    nametag={'marker'} 
                    editable removable 
                    removalCallback={ () => {this.removeMarkerFromState(index)} }
                    saveContentCallback={ content => {this.saveContentToState(content, position, index)} }>
                        {markerText.popupContent}
                    </Popup>
                </Marker>)

        }

        // return (

            return (
            

            <React.Fragment>
            {/* <button  onClick={this.resetView}>Reset view</button> */}

            <Map onViewportChanged={this.onViewportChanged} viewport={this.state.viewport} center={[this.props.latitude, this.props.longitude]} onClick={this.addMarker} zoom={4} maxBounds={[[90,-180],[-90, 180]]}>
            <TileLayer
                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                minZoom = {1}
                maxZoom = {18}
                noWrap={true}
                    />
                {content}
                {new_content}
            <Control position="bottomright">
                      <button class="btn-resetview" onClick={this.handleClick}>Reset view</button>
                    </Control>
            </Map>   
            </React.Fragment>

            )

            
            // <Map center={[this.props.latitude, this.props.longitude]} onClick={this.addMarker} zoom={12} maxBounds={[[90,-180],[-90, 180]]}>
            //     <TileLayer
            //         url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            //         minZoom = {1}
            //         maxZoom = {18}
            //         noWrap={true}
            //     />
            //     {content}
            //     {new_content}
                
            // </Map>
        
    }
}



export default ProtoMap