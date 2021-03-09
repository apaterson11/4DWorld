import React from 'react';
import Grid from '@material-ui/core/Grid';
import axiosInstance from '../axios'
require("./LayerControl.css");

// the UI component for filtering the subway entrances by subway line
export default class EditMarker extends React.Component{

    state = {
        layers: this.props.layers,
        layer_name: '',
        layer_desc: '',
    }

  // this is the JSX that will become the Filter UI in the DOM, notice it looks pretty similar to HTML
  // notice in the select element onChange is set to the updateFilter method
  // thus when a user selects a new subway line to view, the component passes the new filter value
  // to the parent component, Map, which reloads the GeoJSON data with the current filter value

    handleLayer = (e) => {
        this.setState({currentlayer: e.target.value.id});
    }

    addLayer = () => {
        const response = axiosInstance.post(`/layers/`, {
            name: this.state.layer_name,
            description: this.state.layer_desc,
        }).then(response => {
            let newLayers = [...this.state.layers] // copy original state
            newLayers.push(response.data)  // add the new landmark to the copy
            this.setState({layers: newLayers}) // update the state with the new landmark
        })
    }; 

    render(
       
    ){
        return (
        <div className="layerControlPopup">
            <h3>Layer Add</h3>
            <hr/>
                <Grid container spacing={2} direction="column">
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