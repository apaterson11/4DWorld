import { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'
import CreateProjectForm from './CreateProjectForm'
import CreateMapForm from './CreateMapForm'
import { MAP_OPTIONS } from '../../MapOptions'
import axiosInstance from '../../axios'

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
    const [mapOptions, setMapOptions] = useState([])
    const [mapOption, setMapOption] = useState(null)

    useEffect(() => {
        axiosInstance.get('/map-styles')
            .then(response => {
                setMapOptions(response.data)
                setMapOption(response.data[0])
            })
    }, [])

    return (
        <>
        {(mapOptions.length === 0 || mapOption == null) ? 
            (<h2>Fetching...</h2>) 
        : 
        (<Grid container component="main" className={classes.pad}>
            <Grid item xs={12} md={8} >
                <CreateMapForm mapOption={mapOption}/>
            </Grid>
            <Grid item xs={12} md={4} >
                <CreateProjectForm mapOptions={mapOptions} mapOption={mapOption} setMapOption={setMapOption}/>
            </Grid>
        </Grid>)                     
        }
        </>
    )

}

export default CreateProject