import React from 'react';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
require("./LayerControl.css");

// for adding layers
export default class EditMarker extends React.Component{

    state = {
        layers: this.props.layers,
        layer_name: '',
        layer_desc: '',
    }

    handleLayer = (e) => {
        this.setState({currentlayer: e.target.value.id});
    }

    // adds layer via POST request
    addLayer = () => {
        const response = axiosInstance.post(`/layers/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new layer to the copy
            this.setState({layers: newLayers}) // update the state with the new layer
        })
    }; 

    render(
    ){
        return (
        <div className="layerControlPopup">
            <h3>Layer Add</h3>
            <hr/>
                <Grid container spacing={2} direction="column">

                {/* form for entering data to be sent in POST request and for submitting POST request*/}
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
                            onClick={() => this.addLayer()}
                        > Submit
                        </button>
                    </form>
                </Grid>
            </Grid>
        </div>
        )
    }
}