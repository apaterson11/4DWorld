import React from "react";
import { Button, MenuItem, InputLabel, Select } from '@material-ui/core/';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

export default class EditMarker extends React.Component{

    state = {
        content: this.props.content,
        icontype: this.props.icontype,

    }

    handleEdit = () => {
        console.log("test");
        this.props.markerEdit(this.state.content, this.state.icontype, this.props.lat, this.props.lng, this.props.id);
    }

    handleDelete = () => {
        this.props.markerDelete(this.props.id);
    }

    handleChange = (event) => {
        this.setState({icontype: event.target.value})
    }

    render() {
        return(
            <React.Fragment>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        {this.props.content}
                    </Grid>
                    {/* <Grid item>
                        {"icon type = " + this.props.icontype}
                    </Grid> */}
                    <Grid item>
                        <InputLabel id="label">Content</InputLabel>
                        <TextField
                            value = {this.state.content}
                            onChange = {e => this.setState({content: e.target.value})} 
                            />
                    </Grid>
                    <Grid item>
                        <InputLabel id="label">Icon type</InputLabel>
                        <Select
                            id="simple-select"
                            value={this.state.icontype}
                            onChange={e => this.setState({icontype: e.target.value})}
                        >
                            <MenuItem value={"default"}>Select:</MenuItem>
                            <MenuItem value={"battle"}>Battle</MenuItem>
                            <MenuItem value={"knowledge"}>Knowledge</MenuItem>
                            <MenuItem value={"religious"}>Religious</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item>   
                        <Button
                            onClick={this.handleDelete}
                            size="sm"
                            color="secondary"
                        > Delete Marker
                        </Button>
                        <Button
                            onClick={this.handleEdit}
                            size= "sm"
                            color="primary"
                        > Submit changes
                        </Button>
                    </Grid>
                </Grid>
          </React.Fragment>
        )
    }
}