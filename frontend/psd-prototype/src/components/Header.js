import '../App.css';
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/styles'
import React from 'react'

// define styling for the navigation bar
const styles = () => ({
    navbarDiv: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    linkText: {
        color: 'white'
    }
});

// displays navigation bar at top of page
class Header extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
        }
    }

    Toggle = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    }

    render() {
        const {classes} = this.props
        
        let navLinks;
        if (this.props.isAuthenticated) {
            // if user is logged in, show links to Dashboard and Log Out pages
            // otherwise show links to Login and Register pages
            navLinks = (
                <React.Fragment>
                    <li>
                        <Link className={classes.linkText} to="/">Home</Link>
                    </li>
                    <li>
                        <Link className={classes.linkText} to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link className={classes.linkText} to="/logout/">Logout</Link>
                    </li>
                </React.Fragment>
            )
        } else {
            navLinks = (
                <React.Fragment>
                    <li>
                        <Link className={classes.linkText} to="/">Home</Link>
                    </li>
                    <li>
                        <Link className={classes.linkText} to="/login/">Login</Link>
                    </li>
                    <li>
                        <Link className={classes.linkText} to="/register/">Register</Link>
                    </li>
                </React.Fragment>
            )
        }

        return (
            // renders navigation bar at top of page
            <div className="navBar">
                <button className="btn-right menu-hamburger-icon" onClick={this.Toggle}>
                    <MenuIcon />
                </button>
                <div className={classes.navbarDiv}>
                    <ul className={this.state.toggle ? "links show-nav" : "links"}>
                        { navLinks }
                    </ul>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Header)