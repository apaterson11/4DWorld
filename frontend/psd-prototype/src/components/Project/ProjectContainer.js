import React, { useState, useEffect } from "react";
import axiosInstance from "../../axios";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ProjectCard from "./ProjectCard";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import ProjectDetailModal from "./ProjectDetailModal";

const useStyles = makeStyles({
  paper: {
    padding: "0% 5% 5% 5%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header: {
    margin: "40px",
  },
  row: {
    display: "flex",
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#6C8C4C",
    fontSize: "18px",
    color: "white",
  },
  icon: {
    color: "white",
  },
});

function ProjectContainer() {
  const classes = useStyles();
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [clickedProject, setClickedProject] = useState(null);

  const fetchProjects = () => {
    axiosInstance
      .get("/projects/")
      .then((response) => setProjects(response.data));
  }; // Fetches projects that user has access to 

  useEffect(() => {
    fetchProjects();
  }, []);

  let renderCard = () => {
    if (projects.length === 0) {
      return <Typography>You have no projects yet</Typography>;
    }
    return projects.map((project) => (
      <Grid item sm={12} md={4}>
        <ProjectCard
          project={project}
          key={project.id}
          setOpen={setOpen}
          setClickedProject={setClickedProject}
        />
      </Grid>
    ));
  };

  // Displays projects that the user has access to 
  return (
    <React.Fragment>
      <ProjectDetailModal
        open={open}
        onClose={() => {
          setOpen(false);
          setClickedProject(null);
        }}
        project={clickedProject}
        setProjects={fetchProjects}
      />
      <div className={classes.row}>
        <div>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.header}
          >
            My Projects
          </Typography>
        </div>
        <div>
          <Link to="/projects/create/">
            <Chip
              label={"Add"}
              className={classes.chip}
              icon={<AddCircleIcon className={classes.icon} />}
              clickable={true}
            />
          </Link>
        </div>
      </div>

      <Grid container component="main" className={classes.paper}>
        {renderCard()}
      </Grid>
    </React.Fragment>
  );
}

export default ProjectContainer;
