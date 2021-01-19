import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ProfileCard from './ProfileCard'
import ProjectContainer from './ProjectContainer'

const useStyles = makeStyles({
    root: {
      height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    pad: {
        paddingLeft: '20px',
        paddingRight: '20px'
    },
})

function Profile(props) {
    const classes = useStyles();
    return (
        <Grid container component="main">
            <Grid item xs={12} sm={4} md={4} 
                className={classes.pad} component={Paper} square>
                <ProfileCard userDetails={props.userDetails} />
            </Grid>
            <Grid item wrap='wrap' xs={12} sm={8} md={8}>
                <ProjectContainer />
            </Grid>
        </Grid>
    )
}
    
export default Profile