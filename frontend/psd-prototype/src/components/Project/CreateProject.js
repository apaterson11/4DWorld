import { useState } from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import CreateProjectForm from './CreateProjectForm'
import CreateMapForm from './CreateMapForm'
import { MAP_OPTIONS } from '../../MapOptions'

const useStyles = makeStyles({
    pad: {
      paddingLeft: '50px',
      paddingRight: '50px',
      paddingTop: '30px',
      paddingBottom: '30px'
    }
})

function CreateProject() {
    const classes = useStyles()
    const [mapOption, setMapOption] = useState(MAP_OPTIONS[0])

    return (
        <> 
        <Grid container component="main" className={classes.pad}>
            <Grid item xs={12} md={8} >
                <CreateMapForm mapOption={mapOption}/>
            </Grid>
            <Grid item xs={12} md={4} >
                <CreateProjectForm mapOption={mapOption} setMapOption={setMapOption}/>
            </Grid>
        </Grid>
        </>
    )

}

export default CreateProject