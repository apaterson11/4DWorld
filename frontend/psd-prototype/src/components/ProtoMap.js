import React from "react";
import {Map, TileLayer, Marker, Popup, Polyline, LayersControl, LayerGroup, Circle} from 'react-leaflet';
import {MenuItem, Select} from '@material-ui/core/';
import Control from '@skyeer/react-leaflet-custom-control' 
// import Popup from 'react-leaflet-editable-popup';
import { v4 as uuidv4 } from 'uuid';
//import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LineUtil, marker } from "leaflet";
import axiosInstance from '../axios'
import EditMarker from './EditMarker';
// import { Polyline } from 'react-leaflet-polyline';
import {getImages} from './EditMarker'
import {LayerContent, getLandmarks, addMarker} from './LayerContent';

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

    constructor(props) {
        super(props)
        this.handleLayer = this.handleLayer.bind(this);
    }


    

    state = {
        fetched: false,
        defLat: this.props.latitude,
        defLng: this.props.longitude,
        viewport: DEFAULT_VIEWPORT,
        markertype: "default",
        landmarks: [],
        layers: [],
        currentlayer: "1"
    }

    componentDidMount() {
        /* Fetch the list of landmarks on component loading */
        axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
        axiosInstance.get('/layers/').then(response => this.setState({layers: response.data, fetched: true}))
    }

    handleClick = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    }

    // updates the state to store the current position/zoom of the map
    //onViewportChanged = viewport => {
    //    this.setState({ viewport })
    //}
    
    addMarker = (e) => {
        // console.log(this.state.landmarks);
        // console.log(this.state.landmarks.length);
        /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
        const { lat, lng } = e.latlng;
        const pos = this.state.landmarks.length;
        // console.log("statelandmarks ",this.state.landmarks);
        // console.log(pos);
        const response = axiosInstance.post('/landmarks/', {
            layer: '1',
            content: 'sample text',
            latitude: lat,
            longitude: lng,
            markertype: 'default',
            position: pos,
        }).then(response => {
            let newLandmarks = [...this.state.landmarks] // copy original state
            newLandmarks.push(response.data)  // add the new landmark to the copy
            this.setState({landmarks: newLandmarks}) // update the state with the new landmark
            // console.log("statelandmarks 2 ",newLandmarks);
        })
        
    };

    handleLayer(event) {
        this.setState({currentlayer: event.target.value});
    }
 


    render() {
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let lines = ''
        // 


        // if (fetched) {
        //     content = landmarks.map((landmark, index) =>
        //         <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={(landmark.markertype in iconRef) ? iconRef[landmark.markertype] : blueIcon} >
        //             <Popup 
        //             autoClose={false} 
        //             nametag={'marker'}
        //             minWidth={400} 
        //             maxWidth={2000}
        //             // editable removable 
        //             // removalCallback={ () => {this.removeMarkerFromState(landmark.id)} }
        //             // saveContentCallback={ content => {this.updateLandmarks(content, landmark.markertype, landmark.latitude, landmark.longitude, landmark.id)} }   // why +1? idk
        //             >
        //             <React.Fragment>
        //             <EditMarker 
        //                 content={landmark.content} 
        //                 position={landmark.position}
        //                 icontype={landmark.markertype}  
        //                 lat = {landmark.latitude}
        //                 lng = {landmark.longitude}
        //                 id = {landmark.id}
        //                 markerEdit={this.submitCallback}
        //                 markerDelete={this.submitDelete}>
        //             </EditMarker>
        //             </React.Fragment>
                    
        //             </Popup>
        //         </Marker>)
         

        //     let fromLandmarks = [...this.state.landmarks];
        //     let toLandmarks = [...this.state.landmarks]; 
        //     // make copies of landmarks array

        //     fromLandmarks.pop()
        //     fromLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);
        //     toLandmarks = toLandmarks.slice(1)
        //     toLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);


        //     console.log("from = ",fromLandmarks);
        //     console.log("to = ",toLandmarks);
        //     // two new arrays, from = [1st marker ... 2nd last] and to = [2nd marker ... last]

        //     // console.log("fromLandmarks = ", fromLandmarks[5].latitude);

        //     let range = Array(fromLandmarks.length).fill().map((x,i)=>i)
        //     // range(length of fromLandmarks)

        //     lines = range.map((i) => 
        //         <Polyline 
        //                 key={fromLandmarks.position} 
        //                 positions={[[fromLandmarks[i].latitude, fromLandmarks[i].longitude], [toLandmarks[i].latitude, toLandmarks[i].longitude]]} 
        //                 color={'red'} />)
        //     // creates one line between each pair of markers


            // MOVE EVERYTHING ABOVE TO LAYERCONTENT!!!!


            // console.log("thisstate layers = ", this.state.layers);

            let renderlayers = ''
            renderlayers = this.state.layers.map((e, key) =>

            <LayersControl.Overlay key={e.id} checked name={e.name}>
                <LayerGroup>
                    <LayerContent layer={e.id} layers={this.state.layers} landmarks={this.state.landmarks}></LayerContent>
                </LayerGroup>
            </LayersControl.Overlay>)

            let layerselect = ''
            layerselect = this.state.layers.map((e, key) =>
            <option key={e.id} value={e.name}>{e.name}</option>)

            // console.log(renderlayers);
            // <Polyline 
            //         key={fromLandmarks.position} 
            //         positions={[[fromLandmarks[i].latitude, fromLandmarks[i].longitude], [toLandmarks[i].latitude, toLandmarks[i].longitude]]} 
            //         color={'red'} />)



    

        // }

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


                <Control position="topright">
                    <React.Fragment>
                        <select value={this.state.currentlayer} onChange={this.handleLayer}>
                            {layerselect}
                        </select>
                    </React.Fragment>
                </Control>


                <LayersControl position="topright">
                    {renderlayers}  
                </LayersControl>
                <Control position="bottomright">
                      <button className="btn-resetview" onClick={this.createLines}>{this.state.currentlayer}</button>
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
