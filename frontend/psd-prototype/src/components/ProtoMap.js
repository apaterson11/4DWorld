import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import {Map, TileLayer, Marker} from 'react-leaflet';
import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { marker } from "leaflet";
import axiosInstance from '../axios'

class ProtoMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: false,
            mapRef: null,
            markers: [],
            name: "",
        };
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

          const {name} = "lol"
          const { latitude, longitude } = position;
          const {description} = "content"
          console.log(typeof(name))
          console.log(typeof(latitude))
          console.log(typeof(longitude))
          console.log(typeof(description))

          const response = fetch('http://localhost:8000/api/landmarks/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'no-cors',
            body: JSON.stringify({
                'name':name,
                'latitude':latitude,
                'longitude':longitude,
                'description':description,
            })
        }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
      };

    componentDidMount() {
        const url = 'http://localhost:8000/api/landmarks/'
        fetch(url).then(response => response.json())
                  .then(r => this.setState({landmarks: r, fetched: true}))
    }

    addMarker = (e) => {
        const {markers} = this.state
        markers.push(e.latlng)
        const { lat, lng } = e.latlng;
        this.setState({markers})

        const {name} = 'lol'
        const {description} = 'lol'

        const response = fetch('http://localhost:8000/api/landmarks/',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ 
                name:"lol",
                latitude: lat,
                longitude: lng,
                description:"woo",
            })
        }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    };

    render() {
        const markerText = {
            popupContent: '<h2>sample text</h2>sample text',
            open: false,
            autoClose: true,
        }

        const {fetched, landmarks, popup} = this.state 
        let content = ''
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]}>
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
        }

        let new_content = this.state.markers.map((position, index) =>
            <Marker key = {uuidv4()} position={position} name={markerText.popupContent}>
                <Popup
                autoClose={false} 
                nametag={'marker'} 
                editable removable 
                removalCallback={ () => {this.removeMarkerFromState(index)} }
                saveContentCallback={ content => {this.saveContentToState(content, position, index)} }>
                    {markerText.popupContent}
                </Popup>
            </Marker>
        )

        return (
            <Map center={[this.props.latitude, this.props.longitude]} onClick={this.addMarker} zoom={12} maxBounds={[[90,-180],[-90, 180]]}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    minZoom = {1}
                    maxZoom = {18}
                    noWrap={true}
                />
                {content}
                {new_content}
                
            </Map>
        )
    }
}

/*const DraggableMarker = ({key, position, content}) => {
    const [draggable, setDraggable] = useState(false)
    const [pos, setPosition] = useState(position)
    const markerRef = useRef(key)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])
  
    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={pos}
        ref={markerRef}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? {content}
              : {content}}
          </span>
        </Popup>
      </Marker>
    )
  }*/

export default ProtoMap