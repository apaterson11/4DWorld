import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'
import ProjectCard from './ProjectCard'
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles({
    root: {
      height: '100vh',
      minWidth: "90%"
    },
    paper: {
      margin: '20px 40px 50px 40px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    header: {
        marginTop: '50px',
        marginLeft: '40px'
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    padding: {
        margin: '50px 50px 0px 10px',
    }
});

function ProjectContainer(props) {
    const classes = useStyles()
    const count = 8

    let renderCard = () => {
        let components = []
        for (let i=1; i<=count; i++) {
            components.push(<ProjectCard proj_id={i}/>)
        }
        return components
    }

    return (
        <React.Fragment>
            <div className={classes.row}>
                <div>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.header}>
                        My Projects
                    </Typography>
                </div>
                <div>
                    <AddCircleIcon className={classes.padding} color="primary" />
                </div>
            </div>

            <div className={classes.paper}>
                {renderCard()}
            </div>
        </React.Fragment>
    )
}

export default ProjectContainer