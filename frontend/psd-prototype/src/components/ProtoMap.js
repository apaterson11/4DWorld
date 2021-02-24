import React from "react";
import {Map, TileLayer, Marker, Popup, Polyline, LayersControl, LayerGroup, Circle} from 'react-leaflet';
import Control from '@skyeer/react-leaflet-custom-control' 
import axiosInstance from '../axios'
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
        layerlandmarks: [],
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
            
        })
        
    };

    handleLayer(event) {
        this.setState({currentlayer: event.target.value});
    }
 
    render() {
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let lines = ''

            let renderlayers = ''
            renderlayers = this.state.layers.map((e, key) =>

            <LayersControl.Overlay key={e.id} checked name={e.name}>
                <LayerGroup>
                    <LayerContent layer={e.id} landmark_id={this.state.id} layerlandmarks={this.state.layerlandmarks} content={this.state.content} latitude={this.props.latitude} longitude={this.props.longitude} markertype={this.state.markertype} position={this.state.position} layers={this.state.layers} landmarks={this.state.landmarks}></LayerContent>
                </LayerGroup>
            </LayersControl.Overlay>)

            let layerselect = ''
            layerselect = this.state.layers.map((e, key) =>
            <option key={e.id} value={e.name}>{e.name}</option>)

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

export default ProtoMap
