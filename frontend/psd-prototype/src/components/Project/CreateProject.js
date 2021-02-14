import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper';
import CreateProjectForm from './CreateProjectForm'
import CreateMapForm from './CreateMapForm'

const useStyles = makeStyles({
    paper: {
      height: '93vh',
    }
})

function CreateProject() {
    const classes = useStyles()

    return (
        <> 
        <Grid container component="main">
            <Grid item xs={12} sm={6} md={4} className={classes.paper} component={Paper} square>
                <CreateProjectForm />
            </Grid>
            <Grid item xs={12} sm={6} md={8} className={classes.paper} component={Paper} square>
                <CreateMapForm />
            </Grid>
        </Grid>
        </>
    )

}

export default CreateProject