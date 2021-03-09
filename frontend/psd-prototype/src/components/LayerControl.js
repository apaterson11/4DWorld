import React from 'react';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
require("./LayerControl.css");

// the UI component for filtering the subway entrances by subway line
export default class EditMarker extends React.Component{

    state = {
        currentlayer: this.props.currentlayer,
        layers: this.props.layers,
        layer_name: this.props.currentlayer.name,
        layer_desc: this.props.currentlayer.description,
    }

  // this is the JSX that will become the Filter UI in the DOM, notice it looks pretty similar to HTML
  // notice in the select element onChange is set to the updateFilter method
  // thus when a user selects a new subway line to view, the component passes the new filter value
  // to the parent component, Map, which reloads the GeoJSON data with the current filter value

    handleLayer = (e) => {
        this.setState({currentlayer: e.target.value.id});
    }

    editLayer = (layer_id) => {
        console.log("attempting edit...")
        const response = axiosInstance.put(`/layers/${layer_id}/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new landmark to the copy
            this.setState({layers: newLayers}) // update the state with the new landmark

            let updatedLayers = [...this.state.layers]  // copy original state
            
            // find the index of the landmark we need to change
            let idx = updatedLayers.findIndex(layer => layer.id === layer_id)
            
            // splice out the landmark to be changed, replacing it with the data from the API response
            updatedLayers.splice(idx, 1, response.data)

            // set the state with the newly updated landmark
            this.setState({
                layers: updatedLayers
            })
        })
    }; 

    removeLayerFromState = (layer_id) => {
        console.log("attempting deletion...")
        /* Deletes the given landmark from the state, by sending a DELETE request to the API */
        const response = axiosInstance.delete(`/layers/${layer_id}/`)
            .then(response => {
                // filter out the landmark that's been deleted from the state
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
                <Grid item>
                    <p>Select Layer:</p>
                    <select value = {this.state.currentlayer}
                        type="select"
                        name="selectLayer"
                        onChange={(e) => this.handleLayer(e)}>
                        { /* We render the select's option elements by maping each of the values of subwayLines array to option elements */ }
                        {
                            this.state.layers.map((e, i) => {
                            return (
                                    <option key={e.id} value={e.name}>{e.name}</option>
                                );
                            }, this)
                        }
                    </select>
                </Grid>
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