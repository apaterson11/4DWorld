import React, {Component, PropTypes} from "react";
import { Button, MenuItem, InputLabel, Select } from '@material-ui/core/';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import RichTextEditor from 'react-rte'

export default class EditMarker extends React.Component{

    /*static propTypes = {
        onChange: PropTypes.func
    }*/

    state = {
        content: this.props.content,
        icontype: this.props.icontype,
        //value: RichTextEditor.createEmptyValue()
        value: RichTextEditor.createValueFromString(this.props.content, 'html'),
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

    onChange = (value) => {
        console.log('on change');
        this.setState({value})
        this.setState({content: value.toString('html')})
        //this.setState({content: e.toString('html')});
        if (this.props.onChange) {
            console.log('dab');
            this.props.onChange(
               value.toString('html')
            );
        }
    };

    render() {
        return(
            <React.Fragment>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </Grid>
                    {/* <Grid item>
                        {"icon type = " + this.props.icontype}
                    </Grid> */}
                    <Grid item>
                        <InputLabel id="label">Content</InputLabel>
                        <RichTextEditor
                            value = {this.state.value}
                            onChange = {this.onChange}
                            //onChange = {e => this.setState({content: e.target.value})} 
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
                            <MenuItem value={"individual"}>Significant Individual</MenuItem>
                            <MenuItem value={"army"}>Army</MenuItem>
                            <MenuItem value={"knowledge"}>Knowledge Site</MenuItem>
                            <MenuItem value={"trading"}>Trading Site</MenuItem>
                            <MenuItem value={"religious"}>Religious Site</MenuItem>
                            <MenuItem value={"battle"}>Battle Site</MenuItem>
                            <MenuItem value={"industry"}>Industry Site</MenuItem>
                            <MenuItem value={"disease"}>Disease/Disaster</MenuItem>
                            <MenuItem value={"village"}>Small Settlement</MenuItem>
                            <MenuItem value={"city"}>Major Settlement</MenuItem>
                            <MenuItem value={"fortress"}>Fortress</MenuItem>
                            
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