import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import axiosInstance from "../../axios";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Spinner from "../Spinner";
import { Autocomplete } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  padTop: {
    marginTop: "20px",
  },
  padH: {
    paddingRight: "5px",
    paddingLeft: "5px",
  },
});

export default function ProjectDetailModal(props) {
  const classes = useStyles();
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [group, setGroup] = useState(null);
  const [map, setMap] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mapOptions, setMapOptions] = useState([]);
  const [mapStyle, setMapStyle] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [maxZoom, setMaxZoom] = useState(null);

  useEffect(() => {
    if (props.open) {
      let proj = props.project;
      setTitle(proj.title);
      setDescription(proj.description);
      setMap(proj.map);
      setLatitude(proj.map.latitude);
      setLongitude(proj.map.longitude);
      setZoom(proj.map.zoom);

      axiosInstance.get(`/groups/${proj.group}/`).then((response) => {
        setGroup(response.data.name);
      });
      axiosInstance.get("/map-styles/").then((response) => {
        setMapOptions(response.data);
        let style = response.data.filter(
          (style) => style.id == proj.map.style
        )[0];
        setMapStyle(style);
        setMaxZoom(style.max_zoom);
      });
    }
  }, [props.open]);

  useEffect(() => {
    if (zoom > maxZoom) {
      setZoom(maxZoom);
    }
  }, [maxZoom]);

  const handleDelete = (e) => {
    axiosInstance.delete(`/projects/${props.project.id}/`).then((res) => {
      props.setProjects();
      props.onClose();
    });
  };

  const handleSubmit = (e) => {
    const putProject = axiosInstance.put(`/projects/${props.project.id}/`, {
      title: title,
      description: description,
    });
    const putMap = axiosInstance.put(`/maps/${map.id}/`, {
      project: props.project.id,
      latitude: latitude,
      longitude: longitude,
      zoom: zoom,
      style: mapStyle.id,
    });
    Promise.all([putProject, putMap]).then((res) => {
      props.setProjects();
      props.onClose();
    });
  };

  const handleMapStyleUpdate = (e, value) => {
    let style = value ? value : mapOptions[0];
    setMapStyle(style);
    setMaxZoom(style.max_zoom);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth={true}
        aria-labelledby="projectDetail"
      >
        <DialogContent>
          {group == null ||
          map == null ||
          mapStyle == null ||
          mapOptions.length == 0 ? (
            <Spinner />
          ) : (
            <>
              <Typography variant="h5">Project</Typography>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                value={title}
                fullWidth
                name="title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                margin="dense"
                id="description"
                label="Description"
                value={description}
                fullWidth
                multiline
                rows={1}
                rowsMax={4}
                name="description"
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                margin="dense"
                id="group"
                label="Group"
                defaultValue={group}
                fullWidth
                name="group"
                InputProps={{
                  readOnly: true,
                }}
              />
              <Typography className={classes.padTop} variant="h5">
                Project Map
              </Typography>
              <Grid container>
                <Grid item xs={12} sm={4} className={classes.padH}>
                  <TextField
                    margin="dense"
                    id="latitude"
                    label="Latitude"
                    value={latitude}
                    fullWidth
                    name="latitude"
                    type="number"
                    InputProps={{
                      inputProps: { min: -90, max: 90 },
                    }}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.padH}>
                  <TextField
                    margin="dense"
                    id="longitude"
                    label="Longitude"
                    value={longitude}
                    fullWidth
                    name="longitude"
                    type="number"
                    InputProps={{
                      inputProps: { min: -180, max: 180 },
                    }}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4} className={classes.padH}>
                  <TextField
                    margin="dense"
                    id="zoom"
                    label="Zoom Level"
                    value={zoom}
                    fullWidth
                    name="zoom"
                    type="number"
                    InputProps={{
                      inputProps: { min: 1, max: mapStyle.max_zoom },
                    }}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Autocomplete
                margin="dense"
                id="style-combobox"
                label="Map Style"
                options={mapOptions}
                getOptionLabel={(option) => option.name}
                size="small"
                fullWidth
                value={mapStyle}
                renderInput={(params) => (
                  <TextField {...params} label="Map Style" margin="dense" />
                )}
                onChange={handleMapStyleUpdate}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
