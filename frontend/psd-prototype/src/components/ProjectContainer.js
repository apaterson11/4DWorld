import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';
import ProjectCard from './ProjectCard'

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
            <Typography gutterBottom variant="h5" component="h2" className={classes.header}>
                My Projects
            </Typography>
            <div className={classes.paper}>
                {renderCard()}
            </div>
        </React.Fragment>
    )
}

export default ProjectContainer