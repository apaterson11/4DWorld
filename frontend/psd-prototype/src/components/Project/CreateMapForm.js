import { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import axiosInstance from '../../axios'
import {Map, TileLayer} from 'react-leaflet'
import Chip from '@material-ui/core/Chip'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import GpsFixedIcon from '@material-ui/icons/GpsFixed'

const useStyles = makeStyles({
    header: {
        marginTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    spaceBetween: {
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    padMap: {
        padding: '10px',
    },
    map: {
        maxHeight: '65vh'
    },
    chip: {
        margin: '5px',
    }
})

function CreateMapForm(props) {
    const DEFAULT_ZOOM = 13
    const DEFAULT_CENTER = [55.86515, -4.25763]
    
    const mapRef = useRef(null)
    const classes = useStyles()
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [states, setStates] = useState([])
    const [selectedState, setSelectedState] = useState(null)
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState(null)
    const [center, setCenter] = useState(DEFAULT_CENTER)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM)

    useEffect(() => {
        const map = mapRef.current.leafletElement
        map.setMaxZoom(props.mapOption.max_zoom)
        map.setMinZoom(props.mapOption.min_zoom)
    }, [props.mapOption])

    useEffect(() => {
        axiosInstance.get('/countries')
            .then(response => setCountries(response.data))
    }, [])

    useEffect(() => {
        if (selectedCountry !== null) {
            axiosInstance.get(`/states?country_id=${selectedCountry.id}`)
                .then(response => setStates(response.data))
        }
    }, [selectedCountry])

    useEffect(() => {
        if (selectedCountry !== null) {
            let url = `/cities?country_id=${selectedCountry.id}`
            if (selectedState !== null) {
                url = `${url}&state_id=${selectedState.id}`
            }
            axiosInstance.get(url)
                .then(response => setCities(response.data))
        }
    }, [selectedCountry, selectedState])

    useEffect(() => {
        if (selectedState !== null) { 
            setCenter([selectedState.latitude, selectedState.longitude])
            setZoom(9)
        }
        setSelectedCity(null)
    }, [selectedState])

    useEffect(() => {
        if (selectedCity !== null) { 
            setCenter([selectedCity.latitude, selectedCity.longitude])
            setZoom(12)
        }
    }, [selectedCity])

    useEffect(() => {
        // Sets the map centre when user selects country
        // Also clears out the state and city values if the country is changed
        if (selectedCountry !== null) {
            setCenter([selectedCountry.latitude, selectedCountry.longitude])
            setZoom(6)
        }
        setSelectedState(null)
        setStates([])
        setSelectedCity(null)
        setCities([])
    }, [selectedCountry])

    const setMapCenter = (e) => {
        const {lat, lng} = mapRef.current.leafletElement.getCenter()
        setCenter([lat, lng])
    }

    return (
        <>
        <Grid container>
            <Grid container item xs={12} className={classes.header}>
                <Grid item xs={12} md={4}>
                    <Typography gutterBottom variant="h5" component="h2">
                        Map Settings
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8} align="right">
                    <Chip 
                        label={`Centre: ${center[0]}, ${center[1]}`} 
                        className={classes.chip} 
                        icon={<GpsFixedIcon />}/>
                    <Chip 
                        label={`Zoom: ${zoom}`} 
                        className={classes.chip}
                        icon={<ZoomOutMapIcon />}/>
                </Grid>
            </Grid>
            <Grid container item xs={12}>
                <Grid item xs={12} md={4} className={classes.spaceBetween}>
                    <Autocomplete
                        margin="normal"
                        id="country-combobox"
                        label="Country"
                        required
                        options={countries}
                        getOptionLabel={(option) => option.name}
                        size='small'
                        fullWidth
                        renderInput={(params) => 
                            <TextField {...params} label="Country" variant='outlined' margin='dense' />
                        }
                        onChange={(e, value) => (value) ? setSelectedCountry(value) : setSelectedCountry(null)}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.spaceBetween}>
                    <Autocomplete
                        margin="normal"
                        id="state-combobox"
                        label="State"
                        required
                        options={states}
                        getOptionLabel={(option) => option.name}
                        size='small'
                        fullWidth
                        value={selectedState}
                        renderInput={(params) => 
                            <TextField {...params} label="State" variant='outlined' margin='dense'/>
                        }
                        onChange={(e, value) => (value) ? setSelectedState(value) : setSelectedState(null)}
                    />
                </Grid>
                <Grid item xs={12} md={4} className={classes.spaceBetween}>
                    <Autocomplete
                        margin="normal"
                        id="city-combobox"
                        label="City"
                        required
                        options={cities}
                        getOptionLabel={(option) => option.name}
                        size='small'
                        fullWidth
                        value={selectedCity}
                        renderInput={(params) => 
                            <TextField {...params} label="City" variant='outlined' margin='dense'/>
                        }
                        onChange={(e, value) => (value) ? setSelectedCity(value) : setSelectedCity(null)}
                    />
                </Grid>
                <Grid item xs={12} className={classes.padMap}>
                    <Map
                        ref={mapRef}
                        className={classes.map}
                        center={center}
                        zoom={zoom} 
                        onzoomend={(e) => setZoom(mapRef.current.leafletElement.getZoom())}
                        ondragend={(e) => setMapCenter(e)}
                        zoomDelta = {0.5}
                        zoomSnap = {0.5}
                        maxBounds={[[90,-180],[-90, 180]]}>
                        <TileLayer
                            url={props.mapOption.url}
                            attribution = {props.mapOption.attribution}
                            noWrap={true}
                            minZoom = {props.mapOption.min_zoom}
                            maxZoom = {props.mapOption.ma_zoom}
                        />
                    </Map> 
                </Grid>
            </Grid>
        </Grid>
        </>
    )
}

export default CreateMapForm