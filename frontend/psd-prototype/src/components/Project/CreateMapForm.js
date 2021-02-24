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
    const mapRef = useRef(null)
    const classes = useStyles()
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])

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
        if (props.selectedCountry !== null) {
            axiosInstance.get(`/states?country_id=${props.selectedCountry.id}`)
                .then(response => setStates(response.data))
        }
    }, [props.selectedCountry])

    useEffect(() => {
        if (props.selectedCountry !== null) {
            let url = `/cities?country_id=${props.selectedCountry.id}`
            if (props.selectedState !== null) {
                url = `${url}&state_id=${props.selectedState.id}`
            }
            axiosInstance.get(url)
                .then(response => setCities(response.data))
        }
    }, [props.selectedCountry, props.selectedState])

    useEffect(() => {
        if (props.selectedState !== null) { 
            props.setCenter([props.selectedState.latitude, props.selectedState.longitude])
            props.setZoom(9)
        }
        props.setSelectedCity(null)
    }, [props.selectedState])

    useEffect(() => {
        if (props.selectedCity !== null) { 
            props.setCenter([props.selectedCity.latitude, props.selectedCity.longitude])
            props.setZoom(12)
        }
    }, [props.selectedCity])

    useEffect(() => {
        // Sets the map centre when user selects country
        // Also clears out the state and city values if the country is changed
        if (props.selectedCountry !== null) {
            props.setCenter([props.selectedCountry.latitude, props.selectedCountry.longitude])
            props.setZoom(6)
        }
        props.setSelectedState(null)
        setStates([])
        props.setSelectedCity(null)
        setCities([])
    }, [props.selectedCountry])

    const setMapCenter = (e) => {
        const {lat, lng} = mapRef.current.leafletElement.getCenter()
        props.setCenter([lat, lng])
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
                        label={`Centre: ${props.center[0]}, ${props.center[1]}`} 
                        className={classes.chip} 
                        icon={<GpsFixedIcon />}/>
                    <Chip 
                        label={`Zoom: ${props.zoom}`} 
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
                        onChange={(e, value) => (value) ? props.setSelectedCountry(value) : props.setSelectedCountry(null)}
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
                        value={props.selectedState}
                        renderInput={(params) => 
                            <TextField {...params} label="State" variant='outlined' margin='dense'/>
                        }
                        onChange={(e, value) => (value) ? props.setSelectedState(value) : props.setSelectedState(null)}
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
                        value={props.selectedCity}
                        renderInput={(params) => 
                            <TextField {...params} label="City" variant='outlined' margin='dense'/>
                        }
                        onChange={(e, value) => (value) ? props.setSelectedCity(value) : props.setSelectedCity(null)}
                    />
                </Grid>
                <Grid item xs={12} className={classes.padMap}>
                    <Map
                        ref={mapRef}
                        className={classes.map}
                        center={props.center}
                        zoom={props.zoom} 
                        onzoomend={(e) => props.setZoom(mapRef.current.leafletElement.getZoom())}
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