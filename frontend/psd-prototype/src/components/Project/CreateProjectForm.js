import Button from '@material-ui/core/Button'
import { Autocomplete } from '@material-ui/lab'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles( (theme) => ({
    header: {
        marginTop: '10px',
        paddingLeft: '10px',
        paddingRight: '10px'
    },
    form: {
        width: '100%',
        paddingLeft: "10px",
        paddingRight: "10px"
    },
    submit: {
        marginTop: '30px',
        marginBottom: '10px',
        backgroundColor: '#002e5b',
        color: 'white'
    },
    pad: {
        marginTop: '30px',
    },
}))

function CreateProjectForm(props) {
    const classes = useStyles()
//Displays project form, This will have a list of the maps from populate_maps, Countries, project name, project description and Groups
    return (
        <>
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h5" component="h2" className={classes.header}>
                    Project Details
                </Typography>
            </Grid>
            <Grid container item xs={12}>
                <form className={classes.form} noValidate>
                    <Grid item xs={12}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="project-title"
                            label="Project Title"
                            variant='outlined'
                            size='small'
                            name="title"
                            error={props.titleHasError}
                            helperText={props.titleHelpText}
                            required
                            fullWidth
                            onChange={(e) => props.setTitle(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            margin="dense"
                            id="project-description"
                            label="Project Description"
                            variant='outlined'
                            multiline
                            rows={1}
                            rowsMax={6}
                            size='small'
                            name="Description"
                            fullWidth
                            onChange={(e) => props.setDescription(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            margin="normal"
                            id="group-combobox"
                            label="Group"
                            options={props.groups}
                            getOptionLabel={(option) => option.name}
                            size='small'
                            fullWidth
                            renderInput={(params) => 
                                <TextField {...params} label="Group" variant='outlined' margin='dense'/>
                            }
                            onChange={(e, value) => (value) ? props.setSelectedGroup(value.id) : props.setSelectedGroup(null)}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h5" component="h2" className={classes.pad}>
                            Map Customization
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            margin="normal"
                            id="style-combobox"
                            label="Style"
                            required
                            options={props.mapOptions}
                            getOptionLabel={(option) => option.name}
                            size='small'
                            fullWidth
                            renderInput={(params) => 
                                <TextField {...params} label="Style" variant='outlined' margin='dense'/>
                            }
                            onChange={(e, value) => (value) ? props.setMapOption(value) : props.setMapOption(props.mapOptions[0])}
                        />
                    </Grid>
                    
                    <Button 
                        fullWidth
                        variant="contained"
                        className={classes.submit}
                        onClick={props.handleSubmit} 
                        disabled={props.title.length === 0}
                    >
                        Create Project
                    </Button>
                </form>
            </Grid>
        </Grid>
        </>
    )
}

export default CreateProjectForm