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
import ImageUploader from 'react-images-upload';
import ImageGallery from 'react-image-gallery';
require("./EditMarker.css");

// const images = [
//     {
//       original: 'https://picsum.photos/id/1018/1000/600/',
//       thumbnail: 'https://picsum.photos/id/1018/1000/600/'
//     },
//     {
//       original: 'https://picsum.photos/id/1015/1000/600/',
//       thumbnail: 'https://picsum.photos/id/1015/1000/600/'
//     },
//     {
//       original: 'https://picsum.photos/id/1019/1000/600/',
//       thumbnail: 'https://picsum.photos/id/1019/1000/600/'
//     },
//   ];

export default class EditMarker extends React.Component{

    /*static propTypes = {
        onChange: PropTypes.func
    }*/

    // constructor(props) {
    //     super(props);
    //     this.onDrop = this.onDrop.bind(this);
    // }

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

    handleEdit = () => {
        this.props.markerEdit(this.state.content, this.state.icontype, this.state.lat, this.state.lng, this.props.id);
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
                    {/* <Grid item>
                        <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                    </Grid> */}
                    {/* <Grid item>
                        {"icon type = " + this.props.icontype}
                    </Grid> */}
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
                            <MenuItem value={"default"}>Select:</MenuItem>
                            <MenuItem value={"battle"}>Battle</MenuItem>
                            <MenuItem value={"knowledge"}>Knowledge</MenuItem>
                            <MenuItem value={"religious"}>Religious</MenuItem>
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
                        </form>
                    </Grid>
                    {/* <Grid item>
                        <Button
                            onClick={this.props.landmark.dragging.enable()}
                            >Toggle drag
                        </Button>
                    </Grid> */}
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