import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../../Context'
import Button from '@material-ui/core/Button';
import { FormControl } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles'
import axiosInstance from '../../axios'

const useStyles = makeStyles({
    ml: {
        'margin': "30px"
    }
})

function CreateProjectForm() {
    const classes = useStyles()
    const [title, setTitle] = useState("")
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [groups, setGroups] = useState([])
    const {userDetails, setUserDetails} = useContext(UserContext)

    useEffect(() => {
        axiosInstance.get(`/user-details/${userDetails.user_id}`).then(response => {
            setGroups(response.data.user.groups.sort(
                (g1, g2) => (g1.name > g2.name) ? 1 : -1)
            )
        })
    }, [])

    const handleCreateProject = async (e) => {
        let response = await axiosInstance.post('/projects/', {
            title: title,
            group: selectedGroup
        })
        console.log(response.data)
    }

    return (
        <form className={classes.ml}>
        <FormControl>
            <TextField
                autoFocus
                margin="dense"
                id="project-title"
                label="Project Title"
                fullWidth
                name="title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
            />
        </FormControl>

        <FormControl>
            <Autocomplete
                id="group-combobox"
                label="Group"
                required
                options={groups}
                getOptionLabel={(option) => option.name}
                style={{ width: 300 }}
                renderInput={(params) => 
                    <TextField {...params} label="Combo box" variant="outlined" />
                }
                onChange={(e, value) => setSelectedGroup(value.id)}
            />
        </FormControl>
        
        <Button onClick={handleCreateProject} color="primary">
            Create Project
        </Button>
        
        </form>
    )
}

export default CreateProjectForm