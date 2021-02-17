import { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'
import CreateProjectForm from './CreateProjectForm'
import CreateMapForm from './CreateMapForm'
import axiosInstance from '../../axios'
import Spinner from '../Spinner'

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
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [selectedGroup, setSelectedGroup] = useState(null)

    const DEFAULT_ZOOM = 13
    const DEFAULT_CENTER = [55.86515, -4.25763]
    
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [center, setCenter] = useState(DEFAULT_CENTER)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)

    useEffect(() => {
        axiosInstance.get('/map-styles')
            .then(response => {
                setMapOptions(response.data)
                setMapOption(response.data[0])
            })
    }, [])

    const handleCreateProject = async (e) => {
        let project = await axiosInstance.post('/projects/', {
            title: title,
            description: description,
            group: selectedGroup
        })
        console.log({
            project: project.data.id,
            latitude: center[0],
            longitude: center[1],
            zoom: zoom,
            style: mapOption.id
        })

        let map = await axiosInstance.post('/maps/', {
            project: project.data.id,
            latitude: center[0],
            longitude: center[1],
            zoom: zoom,
            style: mapOption.id
        })
        console.log(map.data)
        
    }

    return (
        <>
        {(mapOptions.length === 0 || mapOption == null) ? 
            (<Spinner /> )
        : 
            (<Grid container component="main" className={classes.pad}>
                <Grid item xs={12} md={8} >
                    <CreateMapForm 
                        mapOption={mapOption}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        selectedState={selectedState}
                        setSelectedState={setSelectedState}
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        center={center}
                        setCenter={setCenter}
                        zoom={zoom}
                        setZoom={setZoom}
                    />
                </Grid>
                <Grid item xs={12} md={4} >
                    <CreateProjectForm 
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setSelectedGroup={setSelectedGroup}
                        handleCreateProject={handleCreateProject}
                        mapOptions={mapOptions} 
                        mapOption={mapOption} 
                        setMapOption={setMapOption}/>
                </Grid>
            </Grid>)                     
        }
        </>
    )

}

export default CreateProject