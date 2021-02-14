import { useContext } from 'react'
import { UserContext } from '../../Context'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    
})

function CreateMapForm() {
    const classes = useStyles()
    const {userDetails, setUserDetails} = useContext(UserContext)

    return <>Test</>
}

export default CreateMapForm