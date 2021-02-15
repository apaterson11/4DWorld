import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import axiosInstance from '../../axios'
import {Map, TileLayer} from 'react-leaflet';

const useStyles = makeStyles({
    header: {
        marginTop: '50px',
        paddingLeft: '40px',
        paddingRight: '40px'
    },
    padDropdowns: {
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingBottom: '40px'
    },
    spaceBetween: {
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    padMap: {
        padding: '10px',
    },
    map: {
        height: '60vh',
    }
})

function CreateMapForm() {
    const classes = useStyles()
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [states, setStates] = useState([])
    const [selectedState, setSelectedState] = useState(null)
    const [cities, setCities] = useState([])
    const [selectedCity, setSelectedCity] = useState(null)

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
        // Clears out the state and city values if the country is unselected
        if (selectedCountry == null) {
            setSelectedState(null)
            setStates([])
            setSelectedCity(null)
            setCities([])
        }
    }, [selectedCountry])

    return (
        <>
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h5" component="h2" className={classes.header}>
                    Default Map
                </Typography>
            </Grid>
            <Grid container item xs={12} className={classes.padDropdowns}>
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
                        className={classes.map}
                        center={[55.86515, -4.25763]} 
                        zoom={13} 
                        maxBounds={[[90,-180],[-90, 180]]}>
                        <TileLayer
                            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                            minZoom = {1}
                            maxZoom = {18}
                            noWrap={true}
                        />
                    </Map> 
                </Grid>
            </Grid>
        </Grid>
        </>
    )
}

export default CreateMapForm