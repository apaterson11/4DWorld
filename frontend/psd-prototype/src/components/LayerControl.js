<<<<<<< HEAD
import React from 'react';
import { render } from 'react-dom'
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
import Example from './example'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DND from './Container'
import {CirclePicker, GithubPicker, CompactPicker} from 'react-color';

require("./LayerControl.css");

// edit/delete layer functionality
export default class LayerControl extends React.Component{
    constructor(props) {
        super(props)
        this.refSelect = React.createRef();
    }
    state = {
        currentlayer: this.props.currentlayer,
        layers: this.props.layers,
        layer_name: this.props.currentlayer.name, 
        layer_desc: this.props.currentlayer.description,   
        layer_type: this.props.currentlayer.type,  
        layer_colour: this.props.currentlayer.colour,
        landmarks: this.props.landmarks,
        landmarksgrouped: this.props.landmarksgrouped,
        layerlandmarks: [],
    }

    // selects layer to be edited and changes layer landmarks to appropriate layer
    handleLayer = (e) => {
        this.state.layers.forEach(item => {
            if (parseInt(item.id) == parseInt(e.target.value)) {
                this.setState({layer_name: item.name, layer_desc: item.description, layer_type: item.type, layer_colour: item.colour})
                this.setState({currentlayer: item}, this.setState({layerlandmarks: this.state.landmarksgrouped[item.id]}))
            }
        })

    }

    handleType = (e) => {
        this.setState({layer_type: e.target.value})
    }

    handleChangeComplete = (color) => {
        this.setState({ layer_colour: color.hex });
    };

    // edits layer via PUT request
    editLayer = (layer_id) => {
        const response = axiosInstance.put(`/layers/${layer_id}/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
            type: this.state.layer_type,
            colour: this.state.layer_colour
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new layer to the copy
            this.setState({layers: newLayers}) // update the state with the new layer

            let updatedLayers = [...this.state.layers]  // copy original state
            
            // find the index of the layer we need to change
            let idx = updatedLayers.findIndex(layer => layer.id === layer_id)
            
            // splice out the layer to be changed, replacing it with the data from the API response
            updatedLayers.splice(idx, 1, response.data)

            // set the state with the newly updated layer
            this.setState({
                layers: updatedLayers
            })
        })
    }; 

    // deletes layer via DELETE request
    removeLayerFromState = (layer_id) => {
        /* Deletes the given layer from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/layers/${layer_id}/`)
            .then(response => {
                // filter out the layer that's been deleted from the state
                this.setState({
                    layers: this.state.layers.filter(layer => layer.id !== layer_id)
                })
            })
      };

    render(
    ){
        return (
        <div className="layerControlPopup">
            <h3>Layer Control</h3>
            <hr/>
                <Grid container spacing={2} direction="column">
                {/* dropdown layer select menu */}
                <Grid item>
                    <p>Select Layer:</p>
                    <select value = {this.state.currentlayer.id}
                        type="select"
                        name="selectLayer"
                        onChange={this.handleLayer}
                        onFocus={this.handleLayer}>
                        { /* list all the layers*/ }
                        {
                            this.state.layers.map(e => {
                            return (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                );
                            }, this)
                        }
                    </select>
                </Grid>

                {/* form for inputting new data and submitting results/deleting layer*/}
                <Grid item>
                    <form> 
                        <label>
                            Name
                            <input type="string" name="name" value={this.state.layer_name} onChange={e => this.setState({layer_name: e.target.value})}/>
                        </label>
                        <label>
                            Description
                            <input type="string" name="description" value={this.state.layer_desc} onChange={e => this.setState({layer_desc: e.target.value})}/>
                        </label>
                        <br></br><br></br>

                        Display type:  
                        <select value={this.state.layer_type}
                            type="select"
                            name="selectLayerType"
                            onChange={this.handleType}
                            onFocus={this.handleType}>
                            <option value="">Select display type:</option>
                            <option value="NDR">Non-directional</option>
                            <option value="DIR">Directional</option>
                            <option value="FIL">Area fill</option>
                        </select>
                        <p>Colour:  
                            <CirclePicker color={this.state.layer_colour} onChangeComplete={this.handleChangeComplete} circleSize={25} circleSpacing={4} width={500}
                            colors ={["#ff0000", "#e91e63", "#9c27b0", "#673ab7", "#3f51d5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
                                       "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",  "#ff5722", "#795548","#ffffff", "#999999","#555555", "#222222", "#607d8b"]}/>
                        </p>
                        <br></br>
                        <label>
                            Marker Order
                            <DndProvider backend={HTML5Backend} >
                                <DND 
                                    layerlandmarks={this.state.landmarksgrouped[this.state.currentlayer.id]}
                                    currentlayer={this.state.currentlayer}
                                    rerenderParentCallback={this.props.rerenderParentCallback}
                                ></DND>
                            </DndProvider>
                        </label>
                        <br></br><br></br>
                        <button
                            onClick={() => this.editLayer(this.state.currentlayer.id)}
                        > Submit changes
                        </button>
                        <button
                            onClick={() => this.removeLayerFromState(this.state.currentlayer.id)}
                        > Delete layer
                        </button>
                    </form>
                </Grid>
            </Grid>
        </div>
        )
    }
=======
import React from 'react';
import { render } from 'react-dom'
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
import Example from './example'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DND from './Container'
import {CirclePicker, GithubPicker, CompactPicker} from 'react-color';

require("./LayerControl.css");

// edit/delete layer functionality
export default class LayerControl extends React.Component{
    constructor(props) {
        super(props)
        this.refSelect = React.createRef();
    }
    state = {
        currentlayer: this.props.currentlayer,
        layers: this.props.layers,
        layer_name: this.props.currentlayer.name, 
        layer_desc: this.props.currentlayer.description,   
        layer_type: this.props.currentlayer.type,  
        layer_colour: this.props.currentlayer.colour,
        landmarks: this.props.landmarks,
        landmarksgrouped: this.props.landmarksgrouped,
        layerlandmarks: [],
    }

    componentDidMount() {

        console.log(this.props.currentlayer)

        // for (var i = 0; i<this.state.layers.length; i++) {
        //     console.log(this.state.layers[i])
        //     console.log(this.state.currentlayer)
        //     if ((parseInt(this.state.layers[i].id)) == parseInt(this.state.currentlayer)) {
        //         console.log(this.state.layers[i].type)
        //         // tl = this layer
        //         let tl = this.state.layers[i]
        //         console.log(tl.name)
        //         console.log(tl)
        //         this.setState({layer_name: tl.name, layer_desc: tl.description, layer_type: tl.type, layer_colour: tl.colour})
        //     }
        // }
    }

    // selects layer to be edited and changes layer landmarks to appropriate layer
    handleLayer = (e) => {

        // for (var i = 0; i<this.state.layers.length; i++) {
        //     // console.log(this.state.layers[i])
        //     // console.log(this.state.currentlayer)
        //     if ((parseInt(this.state.layers[i].id)) == parseInt(e.target.value)) {
        //         console.log(this.state.layers[i].type)
        //         // tl = this layer
        //         let tl = this.state.layers[i]
        //         this.setState({layer_name: tl.name, layer_desc: tl.description, layer_type: tl.type, layer_colour: tl.colour})
        //     }
        // }

        this.state.layers.forEach(item => {
            console.log(item.id, e.target.value)
            if (parseInt(item.id) == parseInt(e.target.value)) {
                console.log("matched ",item.id, e.target.value)
                this.setState({layer_name: item.name, layer_desc: item.description, layer_type: item.type, layer_colour: item.colour})
                this.setState({currentlayer: item}, this.setState({layerlandmarks: this.state.landmarksgrouped[item.id]}))
            }
        })
    
        // let tl = this.state.currentlayer
        // console.log(this.state.currentlayer)
        
            
        
    }

    handleType = (e) => {
        this.setState({layer_type: e.target.value})
    }

    handleChangeComplete = (color) => {
        this.setState({ layer_colour: color.hex });
    };

    // edits layer via PUT request
    editLayer = (layer_id) => {
        const response = axiosInstance.put(`/layers/${layer_id}/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
            type: this.state.layer_type,
            colour: this.state.layer_colour
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new layer to the copy
            this.setState({layers: newLayers}) // update the state with the new layer

            let updatedLayers = [...this.state.layers]  // copy original state
            
            // find the index of the layer we need to change
            let idx = updatedLayers.findIndex(layer => layer.id === layer_id)
            
            // splice out the layer to be changed, replacing it with the data from the API response
            updatedLayers.splice(idx, 1, response.data)

            // set the state with the newly updated layer
            this.setState({
                layers: updatedLayers
            })
        })
    }; 

    // deletes layer via DELETE request
    removeLayerFromState = (layer_id) => {
        /* Deletes the given layer from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/layers/${layer_id}/`)
            .then(response => {
                // filter out the layer that's been deleted from the state
                this.setState({
                    layers: this.state.layers.filter(layer => layer.id !== layer_id)
                })
            })
      };

    render(
    ){
        return (
        <div className="layerControlPopup">
            <h3>Layer Control</h3>
            <hr/>
                <Grid container spacing={2} direction="column">
                {/* dropdown layer select menu */}
                <Grid item>
                    <p>Select Layer:</p>
                    <select value = {this.state.currentlayer.id}
                        type="select"
                        name="selectLayer"
                        onChange={this.handleLayer}
                        onFocus={this.handleLayer}
                        ref = {this.refSelect}>
                        { /* list all the layers*/ }
                        {
                            this.state.layers.map(e => {
                            return (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                );
                            }, this)
                        }
                    </select>
                </Grid>

                {/* form for inputting new data and submitting results/deleting layer*/}
                <Grid item>
                    <form> 
                        <label>
                            Name
                            <input type="string" name="name" value={""} onChange={e => this.setState({layer_name: e.target.value})}/>
                        </label>
                        <label>
                            Description
                            <input type="string" name="description" value={""} onChange={e => this.setState({layer_desc: e.target.value})}/>
                        </label>
                        <br></br><br></br>

                        Display type:  
                        <select value={this.state.layer_type}
                            type="select"
                            name="selectLayerType"
                            onChange={this.handleType}
                            onFocus={this.handleType}>
                            <option value="">Select display type:</option>
                            <option value="NDR">Non-directional</option>
                            <option value="DIR">Directional</option>
                            <option value="FIL">Area fill</option>
                        </select>
                        <p>Colour:  
                            <CirclePicker color={this.state.layer_colour} onChangeComplete={this.handleChangeComplete} circleSize={25} circleSpacing={4} width={500}
                            colors ={["#ff0000", "#e91e63", "#9c27b0", "#673ab7", "#3f51d5", "#2196f3", "#03a9f4", "#00bcd4", "#009688", "#4caf50",
                                       "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800",  "#ff5722", "#795548","#ffffff", "#999999","#555555", "#222222", "#607d8b"]}/>
                        </p>
                        <br></br>
                        <label>
                            <u>Marker Order</u>
                            <DndProvider backend={HTML5Backend} >
                                <DND 
                                    layerlandmarks={this.state.landmarksgrouped[this.state.currentlayer.id]}
                                    currentlayer={this.state.currentlayer}
                                    rerenderParentCallback={this.props.rerenderParentCallback}
                                ></DND>
                            </DndProvider>
                        </label>
                        <br></br><br></br>
                        <button
                            onClick={() => this.editLayer(this.state.currentlayer.id)}
                        > Submit changes
                        </button>
                        <button
                            onClick={() => this.removeLayerFromState(this.state.currentlayer.id)}
                        > Delete layer
                        </button>
                    </form>
                </Grid>
            </Grid>
        </div>
        )
    }
>>>>>>> 966a9e800cfb9b36d07ade8d2eaf39c1e8a5c9f4
}