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

    state = {
                landmarks: this.props.landmarks,
                splitlandmarks: this.props.splitlandmarks,
                layerlandmarks: this.props.newlandmarks,
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
        console.log("layercontent layerlandmarks = ",this.state.layerlandmarks);
        console.log(this.props.newlandmarks);
    
    }

    fetchData() {
<<<<<<< HEAD
        this.setState({layerlandmarks: []})
        this.getLandmarks()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.landmarks.length !== this.props.landmarks.length) {
=======
        console.log("data being fetched...")
        console.log("calling getLandmarks, layer = ", this.state.layer, ", layerlandmarks = ", this.state.layerlandmarks)
        // let splitlandmarks = Object.values([...this.state.splitlandmarks])
        // this.setState({layerlandmarks: splitlandmarks[this.state.layer]})
        // this.getLandmarks()
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("prevProps length", prevProps.landmarks.length)
        console.log("thisProps length", this.props.landmarks.length)
        if ((this.props.layerlandmarks) && (prevProps.layerlandmarks.length !== this.props.layerlandmarks.length)) {
>>>>>>> 08d6f192dd2e1a4b8d46114e640234ba8fe137b9
            this.fetchData()
        }
    }

    submitEdit = (layer, content, icontype, lat, lng, id, pos, layerlandmarks) => {
        this.updateLandmarks(layer, content, icontype, lat, lng, id, pos, layerlandmarks)
        // window.location.reload();
    }

    updateLandmarks = (layer, content, markertype, lat, lng, landmark_id, position, layerlandmarks) => {
        /* Updates the landmarks by sending a PUT request to the API,
           and updating the state in the then() callback
        */
        const response = axiosInstance.put(`/landmarks/${landmark_id}/`, {
            content: content,
            markertype: markertype,
            latitude: lat,
            longitude: lng,
            layer: layer,
            position: position
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

<<<<<<< HEAD
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
    }
=======
    // getLandmarks = async() => {
    //     // console.log("layer: ", layer, "#####################")
    //     // console.log("layer: ", layer, ", getLandmarks called");
    //     const results = [];
    //     const response = await axiosInstance.get('/landmarks/', {
    //     }).then(response => response.data.forEach(item => {
    //         if (item.layer === this.state.layer) {
    //             results.push(item);
    //         }
    //     }))
    //     this.setState({layerlandmarks: results})
    //     // console.log("layer: ", layer, ", about to set state now")
    //     // console.log("layer: ", layer, ", results", results)
    //     // console.log("layer: ", layer, ", layer landmarks:", layerlandmarks)

    //     // console.log("layer: ", layer, "#####################")
    // }
>>>>>>> 08d6f192dd2e1a4b8d46114e640234ba8fe137b9

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
                console.log("calling getLandmarks, layer = ", this.state.layer, ", layerlandmarks = ", this.state.layerlandmarks)
                //this.setState({layerlandmarks: []})
                //this.getLandmarks()
            })
      };

    render() {
            const layerlandmarks = this.state.layerlandmarks
            let content = ''
            let lines = ''

<<<<<<< HEAD
            // content renders all the landmarks onto the map 
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
=======
            if (layerlandmarks) {
                content = layerlandmarks.map((landmark, index) =>
                <Marker key={landmark.id} position={[landmark.latitude, landmark.longitude]} icon={(landmark.markertype in iconRef) ? iconRef[landmark.markertype] : blueIcon} >
                    <Popup 
                    autoClose={false} 
                    nametag={'marker'}
                    minWidth={400} 
                    maxWidth={2000}
                    >
                    <React.Fragment>
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
            
     

                let fromLandmarks = [...this.state.layerlandmarks];
                let toLandmarks = [...this.state.layerlandmarks]; 
                // make copies of landmarks array
>>>>>>> 08d6f192dd2e1a4b8d46114e640234ba8fe137b9

                fromLandmarks.pop()
                fromLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);
                toLandmarks = toLandmarks.slice(1)
                toLandmarks.sort((a, b) => a.position > b.position ? 1 : -1);

<<<<<<< HEAD
            // range(length of fromLandmarks)
            let range = Array(fromLandmarks.length).fill().map((x,i)=>i)
=======

                //console.log("from = ",fromLandmarks);
                //console.log("to = ",toLandmarks);
                // two new arrays, from = [1st marker ... 2nd last] and to = [2nd marker ... last]

                // console.log("fromLandmarks = ", fromLandmarks[5].latitude);

                let range = Array(fromLandmarks.length).fill().map((x,i)=>i)
                // range(length of fromLandmarks)
>>>>>>> 08d6f192dd2e1a4b8d46114e640234ba8fe137b9

                lines = range.map((i) => 
                    <Polyline 
                            key={fromLandmarks.id} 
                            positions={[[fromLandmarks[i].latitude, fromLandmarks[i].longitude], [toLandmarks[i].latitude, toLandmarks[i].longitude]]} 
                            color={'red'} />)
                // creates one line between each pair of markers
            }

        return (
            <React.Fragment>
                {content}
                {lines}
            </React.Fragment>
        )
        
    }
}

export default LayerContent