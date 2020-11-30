import React from 'react'
import {Button} from '@material-ui/core'
import { Link } from 'react-router-dom'

class Header extends React.Component {

    render() {
        return (
            <Link
                color="primary"
                variant="outlined"
                to="/logout">
                    Logout
            </Link>
        )
    }
}

export default Header