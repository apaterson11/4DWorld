import React, { useEffect, useState, useContext } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
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
import { UserContext } from "../../Context";
import Chip from "@material-ui/core/Chip";
import ShareIcon from "@material-ui/icons/Share";
import { toast } from "react-toastify";
import Toast from "../Toast";

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
  chip: {
    backgroundColor: "#6C8C4C",
    fontSize: "18px",
    color: "white",
  },
  icon: {
    color: "white",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

// allows user to edit details on project e.g. name, desc, groups
export default function ProjectDetailModal(props) {
  const history = useHistory();
  const classes = useStyles();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [group, setGroup] = useState("");
  const [groups, setGroups] = useState("");
  const [map, setMap] = useState(null);
  const [creator, setCreator] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mapOptions, setMapOptions] = useState([]);
  const [mapStyle, setMapStyle] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [maxZoom, setMaxZoom] = useState(null);
  const [viewUrl, setViewUrl] = useState();

  // get user details to use later
  useEffect(() => {
    if (userDetails === undefined) {
      const details = JSON.parse(localStorage.getItem("userDetails"));
      setUserDetails(details);
    }
  }, [userDetails]);

  // get project details to use later
  useEffect(() => {
    if (props.open) {
      let proj = props.project;
      setTitle(proj.title);
      setDescription(proj.description);
      setCreator(proj.creator);
      setMap(proj.map);
      setLatitude(proj.map.latitude);
      setLongitude(proj.map.longitude);
      setZoom(proj.map.zoom);
      setViewUrl(
        `${window.location.origin.toString()}/projects/view/${proj.id}/${
          proj.hash_field
        }`
      );

      const details = JSON.parse(localStorage.getItem("userDetails"));
      if (userDetails === undefined) {
        if (details === null) {
          // if it can't be recovered from localStorage, user needs to login again
          return history.push("/login");
        }
        setUserDetails(details);
      }

      axiosInstance.get(`/groups/${proj.group}/`).then((response) => {
        setGroup(response.data);
      });

      axiosInstance
        .get(`/user-details/${details.profile_id}`)
        .then((response) => {
          setGroups(
            response.data.user.groups.sort((g1, g2) =>
              g1.name > g2.name ? 1 : -1
            )
          );
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

  // delete project
  const handleDelete = (e) => {
    axiosInstance.delete(`/projects/${props.project.id}/`).then((res) => {
      props.setProjects();
      props.onClose();
    });
  };

  // handles updating of project details
  const handleSubmit = (e) => {
    const putProject = axiosInstance.put(`/projects/${props.project.id}/`, {
      title: title,
      description: description,
      group: group.id,
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

  const notify = () => {
    navigator.clipboard.writeText(viewUrl);
    toast.info("View-only mode link copied to your clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
              <div className={classes.row}>
                <div>
                  <Typography variant="h5">Project</Typography>
                </div>
                <div>
                  <Toast />
                  <Chip
                    label={"Share"}
                    className={classes.chip}
                    icon={<ShareIcon className={classes.icon} />}
                    clickable={true}
                    onClick={notify}
                  />
                </div>
              </div>
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
              <Grid item xs={8} md={6}>
                <Autocomplete
                  id="group-combobox"
                  label="Group"
                  options={groups}
                  getOptionLabel={(option) => option.name}
                  size="small"
                  fullWidth
                  disableClearable={true}
                  defaultValue={group}
                  value={group ? group : null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Group"
                      fullWidth
                      margin="dense"
                    />
                  )}
                  onChange={(e, value) => setGroup(value)}
                />
              </Grid>
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
