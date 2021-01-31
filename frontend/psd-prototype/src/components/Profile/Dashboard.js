import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ProfileCard from './ProfileCard'
import ProjectContainer from '../ProjectContainer'
import UserGroupsCard from './UserGroupsCard'

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

function Dashboard(props) {
    const classes = useStyles();

    return (
        <Grid container component="main">
            <Grid item xs={12} sm={6} md={4} className={classes.pad} component={Paper} square>
                <Grid item xs={12}>
                    <ProfileCard />
                </Grid>
                <Grid item xs={12}>
                    <UserGroupsCard />
                </Grid>
            </Grid>
            <Grid item wrap='wrap' xs={12} sm={6} md={8}>
                <ProjectContainer />
            </Grid>
        </Grid>
    )
}
    
export default Dashboard