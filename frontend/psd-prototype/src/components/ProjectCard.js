import React from 'react';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const useStyles = makeStyles({
    card: {
        minWidth: "180px",
        minHeight: "150px",
        margin: "0 10px 20px 10px"
    }
});


function ProjectCard(props) {
    const classes = useStyles()
    
    return (
        <Card className={classes.card}>
            <CardActionArea>
            <CardContent>
                <Typography gutterBottom variant="h6" component="h5">
                    <Link to="demo-map">{props.title}</Link>
                </Typography>
            </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default ProjectCard