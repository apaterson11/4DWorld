import React from "react";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  card: {
    minWidth: "180px",
    minHeight: "150px",
    margin: "0 10px 20px 10px",
  },
});

function ProjectCard(props) {
  const classes = useStyles();

  const handleClick = (e) => {
    console.log("clicked");
  };

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h5">
          <Link to="demo-map">{props.project.title}</Link>
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          to={{
            pathname: `/projects/edit/${props.project.id}`,
            project: props.project,
          }}
        >
          <Button size="small" color="primary">
            Edit
          </Button>
        </Link>
        <Button size="small" color="primary" onClick={handleClick}>
          View
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;
