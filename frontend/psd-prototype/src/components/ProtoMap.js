import React from "react";
import {Map, TileLayer, Marker} from 'react-leaflet';

import Control from '@skyeer/react-leaflet-custom-control' 
import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
//import MarkerClusterGroup from 'react-leaflet-markercluster';
import { marker } from "leaflet";
///import axiosInstance from '../axios'

const DEFAULT_VIEWPORT = {
    center: [55.86515, -4.25763],
    zoom: 13,
  }

const markerText = {
    popupContent: '<h2>sample text</h2>sample text',
    open: false,
    autoClose: true,
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


    /*shouldComponentUpdate(nextProps, nextState) {
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
    }*/
    
    removeMarkerFromState = (index) => {

        console.log(index)

        const response = fetch('http://localhost:8000/api/landmarks/'+index+'/',
          {
              method: 'DELETE',
          }).then(function (response) {
              console.log(response);
          })
          .catch(function (error) {
              console.log(error);
          })

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
    
    saveContentToState = (content, lat, lng, index) => {
          console.log(content)
          console.log(lng)
          console.log(index)

          const response = fetch('http://localhost:8000/api/landmarks/'+index+'/',
          {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                  content: content,
                  latitude: lat,
                  longitude: lng,
            })
          }).then(function (response) {
              console.log(response);
          })
          .catch(function (error) {
              console.log(error);
          })

          const newMarkers = this.state.markers.map( (marker, i) => {
            if (i === 0) {
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
      };

    componentDidMount() {
        const url = 'http://localhost:8000/api/landmarks/'
        fetch(url).then(response => response.json())
                  .then(r => this.setState({landmarks: r, fetched: true}))
    }

    addMarker = (e) => {
        const { lat, lng } = e.latlng;
        const {x} = 'lol'
        const {y} = 'lol'

        const response = fetch('http://localhost:8000/api/landmarks/',
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({ 
                content: 'x',
                latitude: lat,
                longitude: lng,
            })
        }).then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })

        const {markers} = this.state
        markers.push(e.latlng)
        this.setState({markers})
    };

    render() {
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
                    removalCallback={ () => {this.removeMarkerFromState(landmark.id)} }
                    saveContentCallback={ content => {this.saveContentToState(content, landmark.latitude, landmark.longitude, landmark.id)} }   // why +1? idk
                    >
                        {landmark.content}
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

        return (
            

            <React.Fragment>

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
                      <button className="btn-resetview" onClick={this.handleClick}>Reset view</button>
                </Control>
            </Map>   
            </React.Fragment>
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