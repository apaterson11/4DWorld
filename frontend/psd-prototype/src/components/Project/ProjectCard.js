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
    margin: "5px",
  },
  row: {
    display: "flex",
    verticalAlign: "middle",
    justifyContent: "space-between",
  },
});

function ProjectCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h5">
          <Link to="demo-map">{props.project.title}</Link>
        </Typography>
      </CardContent>
      <CardActions className={classes.row}>
        <div>
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
        </div>
        <div>
          <Link
            to={{
              pathname: `/projects/view/${props.project.id}`,
              project: props.project,
            }}
          >
            <Button size="small" color="primary">
              View
            </Button>
          </Link>
        </div>
      </CardActions>
    </Card>
  );
}

export default ProjectCard;
