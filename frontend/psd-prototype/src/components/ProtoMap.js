import React from 'react';
import {Map, TileLayer, Marker} from 'react-leaflet';
import Popup from 'react-leaflet-editable-popup';
import MarkerClusterGroup from 'react-leaflet-markercluster';

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

    setMapRef = (map) => {
        this.setState({ mapRef: map });
    };

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
        
        // Create a new array identical to the old one, and modify it - immutability!
        const newMarkers = [...this.state.markers]
        newMarkers.splice(index, 1)
    
        // ...and save to state
        this.setState({
            markers: newMarkers
        })
      }
    
      saveContentToState = (content, index) => {
    
          const newMarkers = this.state.markers.map( (marker, i) => {
             if (i === index) {
                return {
                   ...marker,
                   popupContent: content,
                }
             } else {
                return marker
             }
          })
    
          this.setState({
             markers: newMarkers
          })
    
      }


    componentDidMount() {
        const url = 'http://127.0.0.1:8000/api/landmarks.json'
        fetch(url).then(response => response.json())
                  .then(r => this.setState({landmarks: r, fetched: true}))
    }

    addMarker = (e) => {
        const {markers} = this.state
        markers.push(e.latlng)
        this.setState({markers})
    }

    render() {
        const markerText = {
            sample: 'sample text'
        }
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let new_content = ''
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={index} position={[landmark.latitude, landmark.longitude]}>
                    <Popup removable editable nametag={'marker'}
                    removalCallback={ index => this.removeMarkerFromState(index) }
                    saveContentCallback={ (content, index) => this.saveContentToState(content, index) }>
                        {landmark.name}
                    </Popup>
                </Marker>)
            
            new_content = this.state.markers.map((position, index) =>
                <Marker key = {`marker-${index}`} position={position}>
                    <Popup removable editable nametag={'marker'} autoClose={false}
                    removalCallback={ index => this.removeMarkerFromState(index) }
                    saveContentCallback={ (content, index) => this.saveContentToState(content, index) }>
                        {markerText.sample}
                    </Popup>
                </Marker>)
        }

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

export default ProtoMap