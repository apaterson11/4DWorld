import React, { useState, useEffect } from 'react'
import axiosInstance from '../../axios'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ProjectCard from './ProjectCard'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Link } from 'react-router-dom'

const useStyles = makeStyles({
    root: {
      height: '100vh',
      minWidth: "90%"
    },
    paper: {
      margin: '20px 40px 50px 40px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    header: {
        marginTop: '50px',
        marginLeft: '40px'
    },
    row: {
        display: 'flex',
        verticalAlign: 'middle'
    },
    padding: {
        margin: '40px 50px 10px 50px',
    },
    largeIcon: {
        width: 45,
        height: 45,
    }
});

function ProjectContainer(props) {
    const classes = useStyles()
    const [projects, setProjects] = useState([])

    useEffect(() => {
        const response = axiosInstance.get('/projects/')
            .then(response => setProjects(response.data))
    }, [])

    let renderCard = () => {
        if (projects.length === 0) {
            return <Typography>You have no projects yet</Typography>
        }
        return projects.map(
            project => <ProjectCard title={project.title} key={project.id}/>
        )
    }

    return (
        <React.Fragment>
            <div className={classes.row}>
                <div>
                    <Typography gutterBottom variant="h5" component="h2" className={classes.header}>
                        My Projects
                    </Typography>
                </div>
                <div className={classes.padding}>
                    <Link to="projects/create/">
                        <AddCircleIcon className={classes.largeIcon} color="primary"/>
                    </Link>
                </div>
            </div>

            <div className={classes.paper}>
                {renderCard()}
            </div>
        </React.Fragment>
    )
}

export default ProjectContainer