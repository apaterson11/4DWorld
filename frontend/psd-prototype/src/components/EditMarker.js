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
import RichTextEditor from 'react-rte';
import axiosInstance from '../axios';
import ImageGallery from 'react-image-gallery';
require("./EditMarker.css");

export default class EditMarker extends React.Component{
    state = {
        landmarks: this.props.landmarks,
        layerlandmarks:this.props.layerlandmarks,
        content: this.props.content,
        position: this.props.position,
        icontype: this.props.icontype,
        lat: this.props.lat,
        lng: this.props.lng,
        value: RichTextEditor.createValueFromString(this.props.content, 'html'),
        selectedFile: null,
        images: [],
        imagesEmptyText: null,
        schemas: [],
        layers: this.props.layers,
        layer: this.props.layer
    }

    componentDidMount() {
        this.getImages()
        // this.getLayers()
    }

    createSelectItems() {
        let items = [];         
        for (let i = 0; i <= this.props.layer; i++) { 
             console.log(i);            
             items.push(<option key={i} value={i}>{i}</option>);   
             //here I will be creating my options dynamically based on
             //what props are currently passed to the parent component
        }
        return items;
    } 

    // getLayers = () => {
    //     axiosInstance.get('/layers/')
    //     .then(response => {
    //         console.log(response)
    //         this.setState({schemas: response});
    //     })
    //     .catch(error => console.log(error.response));
    // }

    handleEdit = () => {
        this.props.markerEdit(this.state.layer, this.state.content, this.state.icontype, this.state.lat, this.state.lng, this.props.id, this.state.position, this.state.layerlandmarks);
    }

    handleDelete = () => {
        this.props.markerDelete(this.props.id);
    }

    // handleChange = (event) => {
    //     this.setState({icontype: event.target.value})
    // }

    onChange = (value) => {
        this.setState({value})
        this.setState({content: value.toString('html')})
    };

    fileSelectedHandler = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    uploadImage = (e) => {
        const formData = new FormData();
        formData.append('image', this.state.selectedFile, this.state.selectedFile.name);
        formData.append('landmark', this.props.id)

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        axiosInstance.post('/landmark-images/', formData, config)
        .then(res => {
            console.log(res);
            this.getImages();
        })
    }

    getImages = (e) => {
        const results = [];
        const response = axiosInstance.get('/landmark-images/', {

        }).then(response => response.data.forEach(item => {
            if (item.landmark == this.props.id) {
                results.push({
                    image: item.image,
                });
            }
            // console.log(results)
            this.setState({images: results.map(obj => ({
                original: `${obj.image}`,
                thumbnail: `${obj.image}`,
            }))})
        }))

    }

    render() {
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
                {label: 'Italic', style: 'ITALIC'},
                {label: 'Underline', style: 'UNDERLINE'}
            ],
            BLOCK_TYPE_DROPDOWN: [
                {label: 'Normal', style: 'unstyled'},
                {label: 'Heading Large', style: 'header-one'},
                {label: 'Heading Medium', style: 'header-two'},
                {label: 'Heading Small', style: 'header-three'}
            ],
            BLOCK_TYPE_BUTTONS: [
                {label: 'UL', style: 'unordered-list-item'},
                {label: 'OL', style: 'ordered-list-item'}
            ]
        }

        return(
            <React.Fragment>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        {"position = " + this.props.position}
                    </Grid>
                    <Grid item>
                        <InputLabel id="label">Content</InputLabel>
                        <RichTextEditor toolbarConfig={toolbarConfig}
                            value = {this.state.value}
                            onChange = {this.onChange}
                            placeholder = 'Enter text here...' 
                        />
                    </Grid>
                    <Grid item>
                        <InputLabel id="label">Images</InputLabel>
                        <ImageGallery items = {this.state.images}
                        showIndex = {false}
                        showBullets = {true}
                        infinite = {true}
                        showThumbnails = {false}
                        showFullscreenButton = {true}
                        showGalleryFullscreenButton = {false}
                        showPlayButton = {false}
                        showGalleryPlayButton = {false}
                        showNav = {true}
                        isRTL = {false}
                        lazyLoad = {true}
                        slideDuration = {450}
                        slideInterval = {2000}
                        slideOnThumbnailOver = {false}
                        useWindowKeyDown = {true}/>
                    </Grid>
                    <Grid item>
                        <InputLabel id="label">Upload new image</InputLabel>
                        <input type="file" onChange={this.fileSelectedHandler}/>
                        <button onClick={this.uploadImage}>Upload</button>
                    </Grid>
                    <Grid item>
                        <InputLabel id="label">Icon type</InputLabel>
                        <Select
                            id="simple-select"
                            value={this.state.icontype}
                            onChange={e => this.setState({icontype: e.target.value})}
                        >
                            <MenuItem value={"default"}>Default</MenuItem>
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
                        <InputLabel id="label">Location</InputLabel>
                        <form>
                            <label>
                                Latitude
                                <input type="number" name="lat" value={this.state.lat} onChange={e => this.setState({lat: e.target.value})} />
                            </label>
                            <label>
                                Longitude
                                <input type="number" name="lng" value={this.state.lng} onChange={e => this.setState({lng: e.target.value})}/> 
                            </label>
                            <label>
                                Position (ordering)
                                <input type="number" name="pos" value={this.state.position} onChange={e => this.setState({position: e.target.value})} />
                            </label>
                        </form>
                    </Grid>

                    <Grid item>
                    <InputLabel id="label">Choose Layer</InputLabel>
                        <Select
                            id="simple-select"
                            value={this.state.layer}
                            onChange={e => this.setState({layer: e.target.value})}
                        >
                        {this.state.layers.map((e, key) => {
                            return <MenuItem value={e.id}>{e.name}</MenuItem>;
                        })}
                        </Select>
                    </Grid>

                    <Grid item>   
                        <Button
                            onClick={this.handleDelete}
                            size="small"
                            variant="outlined"
                            color="secondary"
                        > Delete Marker
                        </Button>
                        <Button
                            onClick={this.handleEdit}
                            size= "small"
                            variant="outlined"
                            color="primary"
                        > Submit changes
                        </Button>
                    </Grid>
                </Grid>
          </React.Fragment>
        )
    }
}