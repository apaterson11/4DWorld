import React, { useContext, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ProfileCard from './ProfileCard'
import ProjectContainer from '../Project/ProjectContainer'
import DropFileContainer from '../Project/DropFileContainer'
import UserGroupsCard from './UserGroupsCard'
import { UserContext } from '../../Context';
import Spinner from '../Spinner';
import { parse } from "papaparse";

const useStyles = makeStyles({
    pad: {
        paddingLeft: '20px',
        paddingRight: '20px',
        height: '92vh'
    },
})

function Dashboard() {
    const classes = useStyles();
    const {userDetails, setUserDetails} = useContext(UserContext)

    const [students, setStudents] = React.useState([
        {email: "fake@gmail.com", name: "fake"}
    ]);

    useEffect(() => {
        if (userDetails === undefined) {
          const details = JSON.parse(localStorage.getItem('userDetails'))
          setUserDetails(details)
        }
      }, [userDetails])

    return (
        <>
        { (userDetails === undefined) 
        ?
            (<Spinner /> )
        :
            (<Grid container component="main">
                <Grid item xs={12} sm={6} md={4} className={classes.pad} component={Paper} square>
                    <Grid item xs={12}>
                        <ProfileCard />
                    </Grid>
                    <Grid item xs={12}>
                        <UserGroupsCard />
                    </Grid>

                    <Grid item xs={12}>
                        <DropFileContainer />
                    </Grid>
                    

                </Grid>
                <Grid item wrap='wrap' xs={12} sm={6} md={8} className={classes.pad}>
                    <ProjectContainer />
                </Grid>
            </Grid>)}
        </>
    )
}
    
export default Dashboard