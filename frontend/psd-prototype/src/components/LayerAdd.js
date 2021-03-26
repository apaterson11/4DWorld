import React from "react";
import Grid from "@material-ui/core/Grid";
import axiosInstance from "../axios";
require("./LayerControl.css");

// for adding layers
export default class EditMarker extends React.Component {
  state = {
    layers: this.props.layers,
    layer_name: "",
    layer_desc: null,
    map: this.props.map,
  };

  handleLayer = (e) => {
    this.setState({ currentlayer: e.target.value.id });
  };

  // adds layer via POST request
  addLayer = (layer_name, layer_desc) => {
    // defaults description to 'default' if no description provided
    if (layer_desc === null || layer_desc === '') {
      layer_desc = 'default'
    }
    const response = axiosInstance
      .post(`/layers/`, {
        name: layer_name,
        description: layer_desc,
        type: "NDR",
        colour: "#000000",
        map: this.state.map.id, //Saves new layer into the Datebase
      })
      .then((response) => {
        let newLayers = [...this.state.layers]; // copy original state
        newLayers.push(response.data); // add the new layer to the copy
        this.setState({ layers: newLayers }); // update the state with the new layer
      });
  };

  render() {

    return (
      <div className="layerControlPopup">
        <h3>Layer Add</h3>
        <hr />
        <Grid container spacing={2} direction="column">
          {/* form for entering data to be sent in POST request and for submitting POST request*/}
          <Grid item>
            <form>
              <label>
                Name
                <input
                  type="string"
                  name="name"
                  value={this.state.layer_name}
                  onChange={(e) =>
                    this.setState({ layer_name: e.target.value })
                  }
                />
              </label>
              <label>
                Description
                <input
                  type="string"
                  name="description"
                  value={this.state.layer_desc}
                  onChange={(e) =>
                    this.setState({ layer_desc: e.target.value })
                  }
                />
              </label>
              <button
                onClick={() =>
                  this.addLayer(this.state.layer_name, this.state.layer_desc)
                }
              >
                Submit
              </button>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}
