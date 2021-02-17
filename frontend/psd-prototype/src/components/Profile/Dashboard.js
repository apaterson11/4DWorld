import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ProfileCard from './ProfileCard'
import ProjectContainer from '../Project/ProjectContainer'
import UserGroupsCard from './UserGroupsCard'

const useStyles = makeStyles({
    pad: {
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '93vh'
    },
})

function Dashboard() {
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
            <Grid item wrap='wrap' xs={12} sm={6} md={8} className={classes.pad}>
                <ProjectContainer />
            </Grid>
        </Grid>
    )
}
    
export default Dashboard