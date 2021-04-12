import React from "react";
import { InputLabel } from "@material-ui/core/";
import Grid from "@material-ui/core/Grid";
import RichTextEditor from "react-rte";
import axiosInstance from "../axios";
import ImageGallery from "react-image-gallery";
require("./EditMarker.css");

// popup attached to landmark (view mode)
export default class EditMarker extends React.Component {
  state = {
    landmarks: this.props.landmarks,
    layerlandmarks: this.props.layerlandmarks,
    content: this.props.content,
    position: this.props.position,
    icontype: this.props.icontype,
    lat: this.props.lat,
    lng: this.props.lng,
    value: RichTextEditor.createValueFromString(this.props.content, "html"),
    selectedFile: null,
    images: [],
    imagesEmptyText: null,
    schemas: [],
    layers: this.props.layers,
    layer: this.props.layer,
    currentImage: "",
  };

  componentDidMount() {
    this.getImages();
  }

  // get images for each landmark
  getImages = (e) => {
    const results = [];
    const items = [];
    const getRoute = this.props.uuid
      ? `/landmark-images?uuid=${this.props.uuid}`
      : "/landmark-images/";
    const response = axiosInstance.get(getRoute, {}).then((response) =>
      response.data.forEach((item) => {
        if (item.landmark == this.props.id) {
          // matches up each series of images to their corresponding landmark
          results.push({
            image: item.image,
          });
          items.push({
            id: item.id,
            landmark: item.landmark,
            image: item.image,
            image_name: item.image_name,
          });
        }

        // maps results so that they can be displayed in image gallery
        this.setState({
          items: results.map((obj) => ({
            original: `${obj.image}`,
            thumbnail: `${obj.image}`,
          })),
        });
      })
    );

    this.setState({ images: items });
  };

  render() {
    const toolbarConfig = {
      // toolbarConfig defines what is displayed at the top of the rich text editor (e.g. bold, italics)
      display: [
        "INLINE_STYLE_BUTTONS",
        "BLOCK_TYPE_BUTTONS",
        "BLOCK_TYPE_DROPDOWN",
        "HISTORY_BUTTONS",
      ],
      INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD", className: "custom-css-class" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" },
      ],
      BLOCK_TYPE_DROPDOWN: [
        { label: "Normal", style: "unstyled" },
        { label: "Heading Large", style: "header-one" },
        { label: "Heading Medium", style: "header-two" },
        { label: "Heading Small", style: "header-three" },
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" },
      ],
    };

    // conditional rendering depending on whether or not any images have been uploaded to landmark
    let imageGalleryMessage = "";
    let imagelabel = "";
    let imageselect = "";
    let deleteimage = "";
    let deletebutton = "";
    let deletelabel = "";

    if (this.state.images.length == 0) {
      imageGalleryMessage = "";
      imageselect = "";
      deleteimage = "";
      deletebutton = "";
      imagelabel = "";
      deletelabel = "";
    } else {
      imagelabel = <InputLabel id="label">Images</InputLabel>;
      imageGalleryMessage = (
        <ImageGallery
          items={this.state.items}
          showIndex={false}
          showBullets={true}
          infinite={true}
          showThumbnails={false}
          showFullscreenButton={true}
          showGalleryFullscreenButton={false}
          showPlayButton={false}
          showGalleryPlayButton={false}
          showNav={true}
          isRTL={false}
          lazyLoad={false}
          slideDuration={450}
          slideInterval={2000}
          slideOnThumbnailOver={false}
          useWindowKeyDown={true}
        />
      );

      // displays all images if there are any
      imageselect = this.state.images.map((e, key) => (
        <option key={e.id} value={e.id}>
          {e.image_name}
        </option>
      ));

      // functionality for deleting an image from a landmark
      deletelabel = <InputLabel id="label">Delete Image</InputLabel>;

      deleteimage = (
        <select
          onFocus={(e) => this.setState({ currentImage: e.target.value })}
          onChange={(e) => this.setState({ currentImage: e.target.value })}
          required
        >
          <option value="" selected disabled>
            Select an image...
          </option>
          {imageselect}
        </select>
      );
      deletebutton = (
        <button
          disabled={!this.state.currentImage}
          onClick={() => this.removeImage(this.state.currentImage)}
        >
          Delete
        </button>
      );
    }

    return (
      <React.Fragment>
        <Grid container spacing={2} direction="column">
          {/* rich text editor for editing text content */}
          <Grid item>
            <br></br>
            <InputLabel id="label">Content</InputLabel>
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: this.state.content }}
            ></div>
          </Grid>

          {/* image gallery */}
          <Grid item>
            <Grid>
              {imagelabel}
              {imageGalleryMessage}
            </Grid>
          </Grid>

          {/* icon type */}
          <Grid item>
            <InputLabel id="label">Icon type</InputLabel>
            {this.state.icontype}
          </Grid>

          {/* location */}
          <Grid item>
            <InputLabel id="label">Location</InputLabel>
            <form>
              <label>
                Latitude: {this.state.lat}
                <br></br>
              </label>
              <label>Longitude: {this.state.lng}</label>
            </form>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
