import React from "react";
import {Map, TileLayer, LayersControl, LayerGroup} from 'react-leaflet';
import Control from '@skyeer/react-leaflet-custom-control' 
import axiosInstance from '../axios'
import {LayerContent} from './LayerContent';
import Popup from 'reactjs-popup';
import LayerControl from './LayerControl';
import LayerAdd from './LayerAdd';

require("./LayerControl.css");
require("./ProtoMap.css");

const DEFAULT_VIEWPORT = {
    center: [55.86515, -4.25763],   // needs to be changed to values defined in project creation
    zoom: 13,
}

const groupBy = (array, fn) => array.reduce((result, item) => {
    const key = fn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {});

class ProtoMap extends React.Component {

    constructor(props) {
        super(props)
        this.handleLayer = this.handleLayer.bind(this);
        this.refLayerSelect = React.createRef();    // reference used to set current layer
        this.refAddMarkerButton = React.createRef();    // reference used to control add marker button
        this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
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
        layer_name: "",
        layer_desc: "",
        canClick: false,    // add marker functionality, changes when "add marker" button is clicked
        currentlayer: '',
    }

    componentDidUpdate(prevProps, prevState) {
        this.refLayerSelect.current.focus() 
    }

    rerenderParentCallback() {
        axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
        axiosInstance.get('/layers/').then(response => this.setState({layers: response.data, fetched: true}))
        this.forceUpdate();
    }

    componentDidMount() {
        axiosInstance.get('/layers/').then(response => this.setState({layers: response.data, fetched: true}))
        if (this.state.layers) {
            this.setState({currentlayer: this.state.layers[0]})
        }
        axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
    }

    // function to enter into the "add marker" state and indicate to user that button is active
    prepAddMarker = (e) => {
        this.setState({ canClick: !this.state.canClick})
        e.target.style.background = this.state.canClick ? '#b8bfba' : 'white'
    }
    
    // function adds marker to map on click via post request
    addMarker = (e) => {

        /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
        const { lat, lng } = e.latlng;

        let currentlayerlandmarks = this.state.landmarks.filter(landmark => parseInt(landmark.layer) == parseInt(this.state.currentlayer))

        const pos = ((currentlayerlandmarks) ? (currentlayerlandmarks.length) : 0)

        const response = axiosInstance.post('/landmarks/', {
            layer: this.state.currentlayer,
            content: 'sample text',
            latitude: lat,
            longitude: lng,
            markertype: 'default',
            position: pos,
        }).then(response => {
            let newLandmarks = [...this.state.landmarks] // copy original state
            newLandmarks.push(response.data);
            this.setState({landmarks: newLandmarks}) // update the state with the new landmark
        })
        
        
    };

    // function adds new layer through "add layer" button
    addLayer = (layer_id) => {
        const response = axiosInstance.post(`/layers/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new landmark to the copy
            this.setState({layers: newLayers}) // update the state with the new landmark
        })
    }; 

    // function deletes layer through "edit layer" function
    removeLayerFromState = (layer_id) => {
        /* Deletes the given landmark from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/layers/${layer_id}/`)
            .then(response => {
                // filter out the landmark that's been deleted from the state
                this.setState({
                    layers: this.state.layers.filter(layer => layer.id !== layer_id)
                })
            })
      };
    
    // displays correct layers in dropdown layer select menu
    handleLayer(e) {
        this.setState({currentlayer: e.target.value});
    }
 
    render() {
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let lines = ''
        let renderlayers = ''
        let layerselect = ''
        let landmarksgrouped = groupBy([...this.state.landmarks], i => i.layer)

            // toggle layer visibility menu
            renderlayers = this.state.layers.map((e, index) =>

            <LayersControl.Overlay key={e.id} checked name={e.name}>
                <LayerGroup>
                    <LayerContent key={e.id} layer={e.id} landmarksgrouped={landmarksgrouped} layerlandmarks={landmarksgrouped[e.id]} landmark_id={this.state.id} content={this.state.content} latitude={this.props.latitude} longitude={this.props.longitude} markertype={this.state.markertype} position={this.state.position} layers={this.state.layers} landmarks={this.state.landmarks} rerenderParentCallback={this.rerenderParentCallback}></LayerContent>
                </LayerGroup>
            </LayersControl.Overlay>);

            // layer select dropdown menu
            layerselect = this.state.layers.map((e, key) =>
            <option key={e.id} value={e.id}>{e.name}</option>);

        return (
            <Map onViewportChanged={this.onViewportChanged} 
                viewport={this.state.viewport} 
                center={[this.props.latitude, this.props.longitude]} 
                onClick={this.state.canClick ? this.addMarker : undefined} 
                zoom={4} 
                maxBounds={[[90,-180],[-90, 180]]}>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    minZoom = {1}
                    maxZoom = {18}
                    noWrap={true}
                />

                {/* toggle layer visibility menu */}
                <LayersControl position="topright">
                    {renderlayers}  
                </LayersControl>

                {/* select layer dropdown menu */}
                <Control position="topright">
                    <React.Fragment>
                        <div className = 'select-layer'>
                        <p>Select layer: </p>
                        <select value={this.state.currentlayer} onFocus={this.handleLayer} onChange={this.handleLayer} ref={this.refLayerSelect}>
                            {layerselect}
                        </select>
                        </div>
                    </React.Fragment>
                </Control>

                {/* edit layer button */}
                <Popup
                    trigger={open => (
                    <button className="layerControl">Edit Layer</button>
                    )}
                    position="bottom right"
                    closeOnDocumentClick
                >
                    <span>
                        <LayerControl layers = {this.state.layers} currentlayer = {this.state.currentlayer} landmarksgrouped = {landmarksgrouped} landmarks = {this.state.landmarks} rerenderParentCallback={this.rerenderParentCallback}/>
                    </span>
                </Popup>
                
                {/* add layer button */}
                <Popup
                    trigger={open => (
                    <button className="layerControl">Add Layer</button>)}
                    position="bottom right"
                    // on={'hover'}
                >
                    <span>
                        <LayerAdd layers = {this.state.layers}/>
                    </span>
                </Popup>
                
                {/* add marker button */}
                <Control position="topright">
                      <button className="btn-addMarker" onClick={this.prepAddMarker} ref={button => this.refAddMarkerButton = button}>Add Marker</button>
                </Control>
                
                {/* reset view button - will this ever be fixed? only time will tell */}
                <Control position="bottomright">
                      <button className="btn-resetview" onClick={this.handleClick}>Reset View</button>
                </Control>
            </Map>   
        )
    }
}

export default ProtoMap
