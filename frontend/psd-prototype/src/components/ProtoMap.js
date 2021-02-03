import React from "react";
import {Map, TileLayer, Marker} from 'react-leaflet';
import Control from '@skyeer/react-leaflet-custom-control';
import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
//import MarkerClusterGroup from 'react-leaflet-markercluster';
import { marker } from "leaflet";
import axiosInstance from '../axios'

import {
	blueIcon,
	greenIcon,
	blackIcon,
	violetIcon,
    redIcon,
    knowledge,
    battle,
    religious
} from './Icons';

<<<<<<< HEAD

// defines the default co-ordinates and zoom level for when the reset view button is clicked
=======
>>>>>>> master
const DEFAULT_VIEWPORT = {
    center: [55.86515, -4.25763],
    zoom: 13,
}

<<<<<<< HEAD
// dictionary mapping marker names to the markers themselves
const iconRef = {"knowledge": knowledge, "battle": battle, "religious": religious};



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
            viewport: DEFAULT_VIEWPORT,
            markertype: "knowledge",
        };
    }

    // sets the maps' zoom and position to the defaults when 'reset view' pressed
    handleResetClick = () => {
=======
const markerText = {
    popupContent: '<h2>sample text</h2>sample text',
    open: false,
    autoClose: true,
}

// dictionary mapping marker names to the markers themselves
const iconRef = {"knowledge": knowledge, "battle": battle, "religious": religious};


class ProtoMap extends React.Component {
    state = {
        fetched: false,
        defLat: this.props.latitude,
        defLng: this.props.longitude,
        viewport: DEFAULT_VIEWPORT,
        markertype: "knowledge"
    }

    componentDidMount() {
        /* Fetch the list of landmarks on component loading */
        axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
    }

    /* sets the maps' zoom and position to the defaults when 'reset view' pressed */
    handleClick = () => {
>>>>>>> master
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    /* sets the state to the right markertype */
    handleKnowledge = () => {
        this.setState({ markertype: "knowledge" })
    }
    handleBattle = () => {
        this.setState({ markertype: "battle" })
    }
    handleReligious = () => {
        this.setState({ markertype: "religious" })
    }

    

    // sets the state to the right markertype
    handleKnowledge = () => {
        this.setState({ markertype: "knowledge" })
    }
    
    handleBattle = () => {
        this.setState({ markertype: "battle" })
    }
    
    handleReligious = () => {
        this.setState({ markertype: "religious" })
    }
    
    // updates the state to store the current position/zoom of the map
    onViewportChanged = viewport => {
        this.setState({ viewport })
    }
<<<<<<< HEAD

    // getMarkerType = () => {
    //     console.log(this.state.markertype);
    //     return toString(this.state.markertype);
    // }



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
=======
>>>>>>> master
    
    removeMarkerFromState = (landmark_id) => {
        /* Deletes the given landmark from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/landmarks/${landmark_id}/`)
            .then(response => {
                // filter out the landmark that's been deleted from the state
                this.setState({
                    landmarks: this.state.landmarks.filter(landmark => landmark.id !== landmark_id)
                })
            })
      };
    
<<<<<<< HEAD
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

          const {name} = content
          const { lat, lng } = position;
          const {description} = content

          const response = fetch('http://localhost:8000/api/landmarks/',
          {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8'
              },
              body: JSON.stringify({ 
                  name:'marker',
                  latitude: lat,
                  longitude: lng,
                  description:'y',
              })
          }).then(function (response) {
              console.log(response);
          })
          .catch(function (error) {
              console.log(error);
          })
      };
=======
    updateLandmarks = (content, markertype, lat, lng, landmark_id) => {
        /* Updates the landmarks by sending a PUT request to the API,
           and updating the state in the then() callback
        */
        const response = axiosInstance.put(`/landmarks/${landmark_id}/`, {
            content: content,
            markertype: markertype,
            latitude: lat,
            longitude: lng
        }).then(response => {
            let updatedLandmarks = [...this.state.landmarks]  // copy original state
            
            // find the index of the landmark we need to change
            let idx = updatedLandmarks.findIndex(landmark => landmark.id === landmark_id)
            
            // splice out the landmark to be changed, replacing it with the data from the API response
            updatedLandmarks.splice(idx, 1, response.data)
>>>>>>> master

            // set the state with the newly updated landmark
            this.setState({
                landmarks: updatedLandmarks
            })
        })
      };

    addMarker = (e) => {
        /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
        const { lat, lng } = e.latlng;
        const type = this.state.markertype;
        const response = axiosInstance.post('/landmarks/', {
            content: 'x',
            latitude: lat,
            longitude: lng,
            markertype: type
        }).then(response => {
            let newLandmarks = [...this.state.landmarks] // copy original state
            newLandmarks.push(response.data)  // add the new landmark to the copy
            this.setState({landmarks: newLandmarks}) // update the state with the new landmark
        })
    };

    render() {
<<<<<<< HEAD
        const markerText = {
            popupContent: '<h2>sample text</h2>sample text',
            open: false,
            autoClose: true,
        }

        const {fetched, landmarks, markertype, popup} = this.state 
        let content = ''
        let new_content = ''

        // console.log(this.state.markertype);
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={uuidv4()} position={[landmark.latitude, landmark.longitude]} icon={battle}> 
=======
        const {fetched, landmarks, popup} = this.state 
        const icon = blueIcon
        let content = ''
        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={(landmark.markertype in iconRef) ? iconRef[landmark.markertype] : blueIcon}>
>>>>>>> master
                    <Popup 
                    autoClose={false} 
                    nametag={'marker'} 
                    editable removable 
<<<<<<< HEAD
                    removalCallback={ () => {this.removeMarkerFromState(index)} }
                    saveContentCallback={ content => {this.saveContentToState(content, landmark.latitude, landmark.longitude, index)}}
=======
                    removalCallback={ () => {this.removeMarkerFromState(landmark.id)} }
                    saveContentCallback={ content => {this.updateLandmarks(content, landmark.markertype, landmark.latitude, landmark.longitude, landmark.id)} }   // why +1? idk
>>>>>>> master
                    >
                        {landmark.content}
                    </Popup>
                </Marker>)
<<<<<<< HEAD
            
            console.log(this.state.markertype);
            console.log(icontype);
            new_content = this.state.markers.map((position, index) =>
                <Marker key = {uuidv4()} position={position} name={markerText.popupContent} icon={iconRef[this.state.markertype]}>
                    <Popup
                    autoClose={false} 
                    nametag={'marker'} 
                    editable removable 
                    removalCallback={ () => {this.removeMarkerFromState(index)} }
                    saveContentCallback={ content => {this.saveContentToState(content, position, index)} }>
                        {markerText.popupContent}
                    </Popup>
                </Marker>)

=======
>>>>>>> master
        }

        return (
            <Map onViewportChanged={this.onViewportChanged} 
                viewport={this.state.viewport} 
                center={[this.props.latitude, this.props.longitude]} 
                onClick={this.addMarker} 
                zoom={4} 
                maxBounds={[[90,-180],[-90, 180]]}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    minZoom = {1}
                    maxZoom = {18}
                    noWrap={true}
                />
                {content}

<<<<<<< HEAD
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
                {this.state.markertype}
                <Marker position={[55.87338175227069, -4.2892223596572885]} name={"Library"} icon={knowledge}>
 
                </Marker>
                <Marker position={[55.86846080125798, -4.294474124908448]} name={"Maths 2A"} icon={battle}>
                </Marker>

=======
>>>>>>> master
                <Control position="bottomleft">
                    <div class="btn-markertypes">
                        <button onClick={this.handleBattle}>Battle</button>
                        <button onClick={this.handleKnowledge}>Knowledge</button>
                        <button onClick={this.handleReligious}>Religious</button>
                    </div>
                </Control>

                <Control position="bottomright">
<<<<<<< HEAD
                      <button class="btn-resetview" onClick={this.handleResetClick}>Reset view</button>
=======
                      <button className="btn-resetview" onClick={this.handleClick}>Reset view</button>
>>>>>>> master
                </Control>
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