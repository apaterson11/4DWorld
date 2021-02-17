import React from "react";
import {Map, TileLayer, Marker, Popup, Polyline} from 'react-leaflet';

import Control from '@skyeer/react-leaflet-custom-control' 
// import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
//import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LineUtil, marker } from "leaflet";
import axiosInstance from '../axios'
import EditMarker from './EditMarker';
// import { Polyline } from 'react-leaflet-polyline';

import {
    army,
    battle,
	blueIcon,
    city,
    disease,
    fortress,
    individual,
    industry,
    knowledge,
    religious,
    trading,
    village
} from './Icons';


const DEFAULT_VIEWPORT = {
    center: [55.86515, -4.25763],
    zoom: 13,
}

const iconRef = {"army": army, 
                 "battle": battle, 
                 "city": city, 
                 "disease": disease,
                 "fortress": fortress, 
                 "individual": individual,
                 "industry": industry, 
                 "knowledge": knowledge,
                 "religious": religious, 
                 "trading": trading, 
                 "village": village
                 };



const markerText = {
    popupContent: '<h2>sample text</h2>sample text',
    open: false,
    autoClose: true,
}

class ProtoMap extends React.Component {
    state = {
        fetched: false,
        defLat: this.props.latitude,
        defLng: this.props.longitude,
        viewport: DEFAULT_VIEWPORT,
        markertype: "default"
    }

    componentDidMount() {
        /* Fetch the list of landmarks on component loading */
        axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
    }

    handleClick = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    // updates the state to store the current position/zoom of the map
    //onViewportChanged = viewport => {
    //    this.setState({ viewport })
    //}
    
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

 


    submitCallback = (content, icontype, lat, lng, id) => {
        this.updateLandmarks(content, icontype, lat, lng, id)
    }

    submitDelete = (content, icontype, lat, lng, id) => {
        this.removeMarkerFromState(content, icontype, lat, lng, id)
    }

    render() {
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let lines = ''
        // 


        if (fetched) {
            content = landmarks.map((landmark, index) =>
                <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={(landmark.markertype in iconRef) ? iconRef[landmark.markertype] : blueIcon}>
                    <Popup 
                    autoClose={false} 
                    nametag={'marker'} 
                    // editable removable 
                    // removalCallback={ () => {this.removeMarkerFromState(landmark.id)} }
                    // saveContentCallback={ content => {this.updateLandmarks(content, landmark.markertype, landmark.latitude, landmark.longitude, landmark.id)} }   // why +1? idk
                    >
                    <React.Fragment>
                    <EditMarker 
                        content={landmark.content} 
                        icontype={landmark.markertype}  
                        lat = {landmark.latitude}
                        lng = {landmark.longitude}
                        id = {landmark.id}
                        markerEdit={this.submitCallback}
                        markerDelete={this.submitDelete}>
                    </EditMarker>
                    </React.Fragment>
                    
                    </Popup>
                </Marker>)
         
            let fromLandmarks = [...this.state.landmarks];
            let toLandmarks = [...this.state.landmarks]; 
            // make copies of landmarks array

            fromLandmarks.pop()
            toLandmarks = toLandmarks.slice(1)
            // two new arrays, from = [1st marker ... 2nd last] and to = [2nd marker ... last]

            // console.log("fromLandmarks = ", fromLandmarks[5].latitude);

            let range = Array(fromLandmarks.length).fill().map((x,i)=>i)
            // range(length of fromLandmarks)

            lines = range.map((i) => 
                <Polyline 
                        key={fromLandmarks.id} 
                        positions={[[fromLandmarks[i].latitude, fromLandmarks[i].longitude], [toLandmarks[i].latitude, toLandmarks[i].longitude]]} 
                        color={'red'} />)
            // creates one line between each pair of markers

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
                
                {lines}
                {/* {landmarks.map((fromLandmarks, toLandmarks) => 
                    {return <Polyline key={fromLandmarks.id} positions={[[fromLandmarks.latitude, fromLandmarks.longitude], [toLandmarks.latitude, toLandmarks.longitude],]} color={'red'} />})}
                <Polyline color={'red'} positions={[[2, 5], [3, 6]]}/> */}
                {/* <Control position="bottomleft">
                    <div class="btn-markertypes">
                        <button onClick={this.handleBattle}>Battle</button>
                        <button onClick={this.handleKnowledge}>Knowledge</button>
                        <button onClick={this.handleReligious}>Religious</button>
                    </div>
                    
                </Control> */}

                <Control position="bottomright">
                      <button className="btn-resetview" onClick={this.createLines}>Reset view</button>
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
