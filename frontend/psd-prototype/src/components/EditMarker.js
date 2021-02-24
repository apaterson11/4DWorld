import React from "react";
import { Button, MenuItem, InputLabel, Select } from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import RichTextEditor from 'react-rte';
import axiosInstance from '../axios';
import ImageGallery from 'react-image-gallery';
require("./EditMarker.css");

export default class EditMarker extends React.Component{

    state = {
        content: this.props.content,
        icontype: this.props.icontype,
        lat: this.props.lat,
        lng: this.props.lng,
        value: RichTextEditor.createValueFromString(this.props.content, 'html'),
        selectedFile: null,
        images: [],
        imagesEmptyText: null,
    }

    componentDidMount() {
        this.getImages()
    }

    // calls updateLandmarks in ProtoMap.js
    handleEdit = () => {
        this.props.markerEdit(this.state.content, this.state.icontype, this.state.lat, this.state.lng, this.props.id);
    }

    // calls removeMarkerFromState in ProtoMap.js
    handleDelete = () => {
        this.props.markerDelete(this.props.id);
    }

    onChange = (value) => {
        this.setState({value})
        this.setState({content: value.toString('html')})
    };

    // first part of image uploading process, allows user to choose file to upload
    fileSelectedHandler = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        })
    }

    // function uploads images to corresponding marker
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
            this.getImages();       // updates images in state
        })
    }

    // function gets images for each marker and displays on component mount and when uploading new images
    getImages = (e) => {
        const results = [];
        const response = axiosInstance.get('/landmark-images/', {

        }).then(response => response.data.forEach(item => {     // for each statement only selects images for corresponding marker
            if (item.landmark === this.props.id) {
                results.push({
                    image: item.image,
                });
            }
            // console.log(results)
            this.setState({images: results.map(obj => ({        // set state to corresponding images and pass to image gallery
                original: `${obj.image}`,
                thumbnail: `${obj.image}`,
            }))})
        }))

    }

    render() {
        const toolbarConfig = {
            // specifies the groups to be displayed on the rte
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
                    {/* <Grid item>
                        <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </Grid> */}
                    {/* <Grid item>
                        {"icon type = " + this.props.icontype}
                    </Grid> */}

                    {/* rte for editing of marker content */}
                    <Grid item>
                        <InputLabel id="label">Content</InputLabel>
                        <RichTextEditor toolbarConfig={toolbarConfig}
                            value = {this.state.value}
                            onChange = {this.onChange}
                            placeholder = 'Enter text here...' 
                        />
                    </Grid>

                    {/* image gallery that displays marker images */}
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

                    {/* upload new image functionality */}
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

                    {/* edit location functionality */}
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
                        </form>
                    </Grid>
                    {/* <Grid item>
                        <Button
                            onClick={this.props.landmark.dragging.enable()}
                            >Toggle drag
                        </Button>
                    </Grid> */}

                    {/* delete and save functionality */}
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