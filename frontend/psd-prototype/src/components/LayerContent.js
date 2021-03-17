import React from 'react';
import axiosInstance from '../axios';
import {Marker, Popup, Polyline} from 'react-leaflet';
import EditMarker from './EditMarker';

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

export class LayerContent extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
                landmarks: this.props.landmarks,
                layerlandmarks: this.props.layerlandmarks,
                landmarksgrouped: this.props.landmarksgrouped,
                layers: this.props.layers,
                layer: this.props.layer,
                landmark_id: this.props.landmark_id,
                content: this.props.content,
                lat: this.props.latitude,
                lng: this.props.longitude,
                icontype: this.props.markertype,
                position: this.props.position,
            }

    componentDidMount() {
        this.fetchData()
    }

    fetchData() {
        this.setState({layerlandmarks: []})
        this.getLandmarks()
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.layerlandmarks && prevProps.layerlandmarks) {
            if (prevProps.layerlandmarks.length !== this.props.layerlandmarks.length) {
                this.fetchData()
            }
        }
        else if (this.props.layerlandmarks) {
            this.fetchData()
        }
    }

    submitEdit = (layer, content, icontype, lat, lng, id, pos, layerlandmarks) => {
        // get the current layer of the changing marker
        let oldlayer = -1
        this.state.layerlandmarks.forEach((marker) => {
            // console.log('marker iter = ',marker)
            // console.log(marker.id + " ==? " + landmark_id)
            if (marker.id == id) {
                // console.log('yes')
                oldlayer = marker.layer
                // console.log(oldlayer, marker.layer)
            }
        })

        // update position if the layer has changed
        let newposition = 0
        let updateOldLayer = false
        console.log("comparing layers", oldlayer, layer)
        if (oldlayer !== layer) {
            console.log("bleh")
            let positions = []

            if (this.state.landmarksgrouped[layer]) {
                this.state.landmarksgrouped[layer].forEach((marker) => {
                    positions.push(parseInt(marker.position))
                })
                newposition = (Math.max(...positions) + 1)
            }
            else {
                this.state.layerlandmarks.forEach((marker) => {
                    if (marker.id == id) {
                        console.log("swag")
                        positions.push(parseInt(marker.position))
                    }
                })
                newposition = (Math.max(...positions))
            }
            updateOldLayer = true
            console.log("update old layer true")
        }

        this.updateLandmarks(layer, content, icontype, lat, lng, id, pos, layerlandmarks, newposition, updateOldLayer)
    }

    updateLandmarks = (layer, content, markertype, lat, lng, landmark_id, position, layerlandmarks, newposition, updateOldLayer) => {
        /* Updates the landmarks by sending a PUT request to the API,
           and updating the state in the then() callback
        */
        console.log(layer)
        console.log("put request going through")
        console.log(landmark_id)
        const response = axiosInstance.put(`/landmarks/${landmark_id}/`, {
            content: content,
            markertype: markertype,
            latitude: lat,
            longitude: lng,
            layer: layer,
            position: newposition
        }).then(response => {
            console.log("put request gone through")
            let updatedLandmarks = [...this.state.landmarks]  // copy original state
            
            // find the index of the landmark we need to change
            let idx = updatedLandmarks.findIndex(landmark => landmark.id === landmark_id)
            
            // splice out the landmark to be changed, replacing it with the data from the API response
            updatedLandmarks.splice(idx, 1, response.data)

            // set the state with the newly updated landmark
            this.setState({landmarks: updatedLandmarks}, this.getLandmarks)
        })
        if (updateOldLayer) {
            this.props.layerlandmarks.forEach((marker, index) => {
                if (marker.id != landmark_id) {
                    axiosInstance.put(`/landmarks/${marker.id}/`, {
                        content: marker.content,
                        markertype: marker.markertype,
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                        layer: marker.layer,
                        position: (index)
                    })
                }
            })
            updateOldLayer = false
        }
    };

    // function gets all landmarks 
    getLandmarks = async() => {
        const results = [];
        const response = await axiosInstance.get('/landmarks/', {
        }).then(response => response.data.forEach(item => {
            if (item.layer === this.state.layer) {
                results.push(item);
            }
        }))
        this.setState({layerlandmarks: results})
        this.props.rerenderParentCallback() // rerender ProtoMap to display change in layers
    }

    // used for passing through to editmarker.js
    submitDelete = (id) => {
        this.removeMarkerFromState(id)
    }

    // removes landmark from state
    removeMarkerFromState = (landmark_id) => {
        /* Deletes the given landmark from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/landmarks/${landmark_id}/`)
            .then(response => {
                // filter out the landmark that's been deleted from the state
                this.setState({
                    landmarks: this.state.landmarks.filter(landmark => landmark.id !== landmark_id)
                })
                this.setState({layerlandmarks: []})
                this.getLandmarks()
            })
      };

    render() {
            const layerlandmarks = this.state.layerlandmarks
            let content = ''
            let lines = ''

            // content renders all the landmarks onto the map 
            if (this.state.layerlandmarks) {
                content = layerlandmarks.map((landmark, index) =>
                <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={(landmark.markertype in iconRef) ? iconRef[landmark.markertype] : blueIcon} >
                    <Popup 
                    autoClose={false} 
                    nametag={'marker'}
                    minWidth={400} 
                    maxWidth={2000}
                    >
                    <React.Fragment>
                    {/* EditMarker is the popup attached to each landmark */}
                    <EditMarker 
                        landmarks={this.state.landmarks}
                        layerlandmarks={this.state.layerlandmarks}
                        content={landmark.content} 
                        position={landmark.position}
                        icontype={landmark.markertype}  
                        lat = {landmark.latitude}
                        lng = {landmark.longitude}
                        id = {landmark.id}
                        layer = {this.state.layer}
                        layers = {this.state.layers}
                        markerEdit={this.submitEdit}
                        markerDelete={this.submitDelete}>
                    </EditMarker>
                    </React.Fragment>
                    </Popup>
                </Marker>)
        
                // make copies of landmarks array
                let fromLandmarks = [...this.state.layerlandmarks];
                let toLandmarks = [...this.state.layerlandmarks]; 

                    fromLandmarks.pop()
                    fromLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);
                    toLandmarks = toLandmarks.slice(1)
                    toLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);

                // range(length of fromLandmarks)
                let range = Array(fromLandmarks.length).fill().map((x,i)=>i)

                    lines = range.map((i) => 
                        <Polyline 
                                key={fromLandmarks.id} 
                                positions={[[fromLandmarks[i].latitude, fromLandmarks[i].longitude], [toLandmarks[i].latitude, toLandmarks[i].longitude]]} 
                                color={'red'} />)
                    // creates one line between each pair of markers
                    return (
                        <React.Fragment>
                            {content}
                            {lines}
                        </React.Fragment>
                    )
                }
                else {
                    return null
                }
            }
            
        
            
    }

export default LayerContent