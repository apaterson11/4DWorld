import React from "react";
import {Map, TileLayer, Marker, Popup, Polyline, LayersControl, LayerGroup, Circle, withLeaflet} from 'react-leaflet';
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
import { __RouterContext } from "react-router";


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

// const groupBy = (arr, property) => {
//     return arr.reduce((acc, cur) => {
//       acc[cur[property]] = [...acc[cur[property]] || [], cur];
//       return acc;
//     }, {});
// }

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
        currentlayer: '',
        splitlandmarks: []
    }

    componentDidUpdate(prevProps, prevState) {


        if (prevState.landmarks.length !== this.state.landmarks.length) {
            this.getData()
        }
    }

    componentDidMount(){
        this.getData()
    }

    getData = async() => {
        await axiosInstance.get('/landmarks/').then(response => this.setState({landmarks: response.data, fetched: true}))
        await axiosInstance.get('/layers/').then(response => this.setState({layers: response.data, fetched: true}))
        this.getSplitLandmarks()

    }
        


    getSplitLandmarks = () => {
        console.log('getSplitLandmarks start')
        console.log('landmark size (getSPLIT) = ',this.state.landmarks.length)

        // console.log([...this.state.landmarks]);

        let splitlandmarks = groupBy([...this.state.landmarks], i => i.layer)
        const testtt = Object.entries(splitlandmarks)
        
        console.log("splitlandmarks =",splitlandmarks);

    
        console.log(testtt);

        this.setState({splitlandmarks: splitlandmarks})



        console.log(this.state.splitlandmarks);
        
        console.log("after-----", this.state.landmarks)



    }

    handleClick = () => {
        console.log(this.state.splitlandmarks[1]);
        
        console.log(Object.values(this.state.splitlandmarks[1]));



        let ids = []
        for (var i=0; i < this.state.landmarks.length; i++) {
            ids.push(parseInt([...this.state.landmarks][i]['id']))
        }
        let id = (Math.max(...ids) + 1)

        // let splitlandmarks = groupBy([...this.state.landmarks], i => i.layer)
        // let testtt = Object.values(splitlandmarks)

        // console.log(testtt)
        // console.log(testtt[1])
        // console.log(testtt[2])

        // for (var i = 0; i < testtt.length; i++) {
        //     console.log(testtt[i][1])
        // }
        this.getData()

        // console.log(test);
        // console.log([...this.state.landmarks]);

        // console.log("testlayers",testlayers);
        // console.log(splitlandmarks[0])

        // this.setState({ viewport: DEFAULT_VIEWPORT })
    }
    
    addMarker = async(e) => {
        this.refLayerSelect.current.focus();
        console.log("currentlayer=",this.state.currentlayer);
        console.log(this.state.splitlandmarks)
        // console.log(this.state.landmarks);
        // console.log(this.state.landmarks.length);
        /* Adds a new landmark to the map at a given latitude and longitude, via a POST request */
        const { lat, lng } = e.latlng;
        // console.log("currentlayer length",this.state.splitlandmarks[parseInt(this.state.currentlayer)].length);
        // const currentlayer = this.state.currentlayer
        const pos = (this.state.splitlandmarks[this.state.currentlayer] != undefined) ? this.state.splitlandmarks[parseInt(this.state.currentlayer)].length : 0
        // console.log("statelandmarks ",this.stat.landmarks);
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

            console.log('landmark size BEFORE = ',this.state.landmarks.length)
            // let ids = []
            // for (var i=0; i < this.state.landmarks.length; i++) {
            //     ids.push(parseInt([...this.state.landmarks][i]['id']))
            // }
            // let id = (Math.max(...ids) + 1)
            // // get the largest id of all landmarks, to assign the next one

            // newLandmarks.push({ id: id,
            //                     layer: this.state.currentlayer,
            //                     content: 'sample text',
            //                     latitude: lat,
            //                     longitude: lng,
            //                     markertype: 'default',
            //                     position: pos})  // add the new landmark to the copy

            newLandmarks.push(response.data);
                                
            this.setState({landmarks: newLandmarks}, this.getSplitLandmarks) // update the state with the new landmark
            console.log('STATE UPDATED in addMarker')
            console.log('landmark size AFTER = ',this.state.landmarks.length)


            console.log('do this after the post please')
        })
        
        
    };

    handleLayer(event) {
        this.setState({currentlayer: event.target.value});
    }
 
    render() {
        const {fetched, landmarks, popup} = this.state 
        let content = ''
        let lines = ''
        const landmarksgrouped = groupBy([...this.state.landmarks], i => i.layer)
        const groupedvalues = Object.values(landmarksgrouped)

            let renderlayers = ''
            console.log("swag ", this.state.splitlandmarks)
            console.log("swag 2 ", this.state.splitlandmarks[1])
            renderlayers = this.state.layers.map((e, index) =>

            <LayersControl.Overlay key={e.id} checked name={e.name}>
                <LayerGroup>
                    <LayerContent key={e.id} layer={e.id} newlandmarks={groupedvalues[0]} landmark_id={this.state.id} splitlandmarks={this.state.landmarks} content={this.state.content} latitude={this.props.latitude} longitude={this.props.longitude} markertype={this.state.markertype} position={this.state.position} layers={this.state.layers} landmarks={this.state.landmarks}></LayerContent>
                </LayerGroup>
            </LayersControl.Overlay>)

            let layerselect = ''
            layerselect = this.state.layers.map((e, key) =>
            <option key={e.id} value={e.id}>{e.name}</option>)

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
                        <select value={this.state.currentlayer} onFocus={this.handleLayer} onChange={this.handleLayer} ref={this.refLayerSelect}>
                            {layerselect}
                        </select>
                    </React.Fragment>
                </Control>


                <LayersControl position="topright">
                    {renderlayers}  
                </LayersControl>
                <Control position="bottomright">
                      <button className="btn-resetview" onClick={this.handleClick}>Button</button>
                </Control>
            </Map>   
        )
    }
}

export default ProtoMap
