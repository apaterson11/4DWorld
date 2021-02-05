import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import CreateProjectForm from './CreateProjectForm'

function CreateProject() {

    return (
        <>
                
        <Grid container component="main">
            <Grid item xs={12} component={Paper} square>
                <CreateProjectForm />
            </Grid>
        </Grid>

        </>
    )

}

export default CreateProject