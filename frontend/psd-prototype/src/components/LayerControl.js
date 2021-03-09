import React from 'react';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
require("./LayerControl.css");

// edit/delete layer functionality
export default class EditMarker extends React.Component{

    state = {
        currentlayer: this.props.currentlayer,
        layers: this.props.layers,
        layer_name: this.props.currentlayer.name,
        layer_desc: this.props.currentlayer.description,
    }

    // selects layer to be edited
    handleLayer = (e) => {
        this.setState({currentlayer: e.target.value});
    }

    // edits layer via PUT request
    editLayer = (layer_id) => {
        const response = axiosInstance.put(`/layers/${layer_id}/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
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
                    <select value = {this.state.currentlayer}
                        type="select"
                        name="selectLayer"
                        onFocus={this.handleLayer}
                        onChange={this.handleLayer}>
                        { /* list all the layers*/ }
                        {
                            this.state.layers.map((e, i) => {
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
                        <button
                            onClick={() => this.editLayer(this.state.currentlayer)}
                        > Submit changes
                        </button>
                        <button
                            onClick={() => this.removeLayerFromState(this.state.currentlayer)}
                        > Delete layer
                        </button>
                    </form>
                </Grid>
            </Grid>
        </div>
        )
    }
}