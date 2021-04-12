import React from "react";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";

const useStyles = makeStyles({
  card: {
    margin: "5px",
  },
  row: {
    display: "flex",
    verticalAlign: "middle",
    justifyContent: "center",
    background: "#EDF0F3",
    color: "white",
  },
});

function ProjectCard(props) {
  const classes = useStyles();

  const onClick = () => {
    props.setClickedProject(props.project);
    props.setOpen(true);
  };

  //Displays project card which has info about the project and buttons to route to view/edit project
  return (
    <>
      <Card className={classes.card} variant="outlined">
        <CardActionArea onClick={onClick}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.project.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.project.description
                ? props.project.description
                : "No description"}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.row}>
          <div>
            <Link
              to={{
                pathname: `/projects/edit/${props.project.id}`,
                project: props.project,
              }}
            >
              <Button size="small" color="primary" startIcon={<EditIcon />}>
                Edit
              </Button>
            </Link>
          </div>
          <div>
            <Link
              to={{
                pathname: `/projects/view/${props.project.id}`,
                project: props.project,
              }}
            >
              <Button size="small" color="primary" endIcon={<VisibilityIcon />}>
                View
              </Button>
            </Link>
          </div>
        </CardActions>
      </Card>
    </>
  );
}

export default ProjectCard;
