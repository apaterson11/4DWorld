import { useState, useEffect, useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import CreateProjectForm from './CreateProjectForm'
import CreateMapForm from './CreateMapForm'
import axiosInstance from '../../axios'
import Spinner from '../Spinner'
import { UserContext } from '../../Context'

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
    const {userDetails, setUserDetails} = useContext(UserContext)
    const [mapOptions, setMapOptions] = useState([])
    const [mapOption, setMapOption] = useState(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [groups, setGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState(null)

    const DEFAULT_ZOOM = 13
    const DEFAULT_CENTER = [55.86515, -4.25763]
    
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [selectedState, setSelectedState] = useState(null)
    const [selectedCity, setSelectedCity] = useState(null)
    const [center, setCenter] = useState(DEFAULT_CENTER)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)

    useEffect(() => {
        if (userDetails === undefined) {
          const details = JSON.parse(localStorage.getItem('userDetails'))
          setUserDetails(details)
        }
      }, [userDetails])

    useEffect(() => {
        axiosInstance.get('/map-styles')
            .then(response => {
                setMapOptions(response.data)
                setMapOption(response.data[0])
            })
    }, [])

    useEffect(() => {
        const details = JSON.parse(localStorage.getItem('userDetails'))
        if (userDetails === undefined) {
            if (details === null) {
                // if it can't be recovered from localStorage, user needs to login again
                console.log("Redirect to login")
            }
            setUserDetails(details)
        }
    
        axiosInstance.get(`/user-details/${details.profile_id}`).then(response => {
            setGroups(response.data.user.groups.sort(
                (g1, g2) => (g1.name > g2.name) ? 1 : -1)
            )
        })
    }, [])

    const handleSubmit = async (e) => {
        let project = await axiosInstance.post('/projects/', {
            title: title,
            description: description,
            group: (selectedGroup !== null) ? selectedGroup : userDetails.default_group
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
        {(mapOptions.length === 0 || mapOption == null || userDetails == undefined) ? 
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
                        title={title}
                        groups={groups}
                        setTitle={setTitle}
                        setDescription={setDescription}
                        setSelectedGroup={setSelectedGroup}
                        handleSubmit={handleSubmit}
                        mapOptions={mapOptions} 
                        mapOption={mapOption} 
                        setMapOption={setMapOption}
                    />
                </Grid>
            </Grid>)                     
        }
        </>
    )

}

export default CreateProject