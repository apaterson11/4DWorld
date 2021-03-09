import React from "react";
import {Map, TileLayer, Marker, Polyline, LayersControl, LayerGroup, Circle} from 'react-leaflet';
import Control from '@skyeer/react-leaflet-custom-control' 
import axiosInstance from '../axios'
import {LayerContent, getLandmarks, addMarker} from './LayerContent';
import { Button, MenuItem, InputLabel, Select } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import Popup from 'reactjs-popup';
import LayerControl from './LayerControl';
import LayerAdd from './LayerAdd';

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

require("./LayerControl.css");

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
        this.refLayerSelect = React.createRef();
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
        currentlayer: "",
        layer_name: "",
        layer_desc: "",
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
        this.refLayerSelect.current.focus()
        // console.log(this.state.landmarks);
        // console.log(this.state.landmarks.length);
        /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
        const { lat, lng } = e.latlng;
        const pos = this.state.landmarks.length;
        // console.log("statelandmarks ",this.state.landmarks);
        // console.log(pos);
        const response = axiosInstance.post('/landmarks/', {
            layer: this.state.currentlayer,
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

    handleLayer(e) {
        this.setState({currentlayer: e.target.value});
        console.log(this.state.currentlayer)
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
            </LayersControl.Overlay>);

            let layerselect = ''
            layerselect = this.state.layers.map((e, key) =>
            <option key={e.id} value={e.id}>{e.name}</option>);


            let editlayer = ''
            editlayer = <Popup
                            trigger={<button className="button">Edit Layer</button>}
                            position="left top"
                            on="hover"
                        >
                        <React.Fragment>
                        <form> 
                            {/* <label>
                                Name
                                <input type="string" name="name" value={this.state.layer_name} onChange={e => this.setState({layer_name: e.target.value})}/>
                            </label>
                            <label>
                                Description
                                <input type="string" name="description" value={this.state.layer_desc} onChange={e => this.setState({layer_desc: e.target.value})}/>
                            </label>
                            <button
                                onClick={this.addLayer(this.state.currentlayer)}
                            > Submit changes
                            </button>
                            <button
                                onClick={this.removeLayerFromState(this.state.currentlayer)}
                            > Delete layer
                            </button> */}
                        </form>
                        </React.Fragment>
                        </Popup>
            

            

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

                <LayersControl position="topright">
                    {renderlayers}  
                </LayersControl>

                <Control position="topright">
                    <React.Fragment>
                        <select value={this.state.currentlayer} onFocus={this.handleLayer} onChange={this.handleLayer} ref={this.refLayerSelect}>
                            {layerselect}
                        </select>
                    </React.Fragment>
                </Control>

                {/* edit layer button */}
                <Popup
                    trigger={open => (
                    <button className="layerControl">Edit Layer</button>
                    )}
                    position="right center"
                    closeOnDocumentClick
                >
                    <span>
                        <React.Fragment>
                            <LayerControl
                            layers = {this.state.layers}
                            currentlayer = {this.state.currentlayer}/>
                        </React.Fragment>
                    </span>
                </Popup>
                
                {/* add layer button */}
                <Popup
                    trigger={open => (
                    <button className="layerControl">Add Layer</button>
                    )}
                    position="right center"
                    closeOnDocumentClick
                >
                    <span>
                        <LayerAdd
                        layers = {this.state.layers}/>
                    </span>
                </Popup>


                

                

                {/* <Control position="topright">
                    <React.Fragment>
                    <select value={this.state.currentlayer} onChange={e => this.setState({currentlayer: e.target.value})}>
                        {layerselect}
                    </select>
                    <form> 
                        <label>
                            Name
                            <input type="string" name="name" value={this.state.layer_name} onChange={e => this.setState({layer_name: e.target.value})}/>
                        </label>
                        <label>
                            Description
                            <input type="string" name="description" value={this.state.layer_desc} onChange={e => this.setState({layer_desc: e.target.value})}/>
                        </label>
                        <button
                            onClick={this.addLayer(this.state.currentlayer)}
                        > Submit changes
                        </button>
                        <button
                            onClick={this.removeLayerFromState(this.state.currentlayer)}
                        > Delete layer
                        </button>
                    </form>
                    </React.Fragment>
                </Control> */}

                <Control position="bottomright">
                      <button className="btn-resetview" onClick={this.createLines}>Reset View</button>
                </Control>
            </Map>   
        )
    }
}

export default ProtoMap
