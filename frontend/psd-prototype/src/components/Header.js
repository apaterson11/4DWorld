import '../App.css';
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/styles'
import React from 'react'


const styles = () => ({
    navbarDiv: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    linkText: {
        color: 'white'
    }
});

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
            navLinks = (
                <React.Fragment>
                    {/* <li>
                        <Link className={classes.linkText} to="/">Project</Link>
                    </li> */}
                    <li>
                        <Link className={classes.linkText} to="/profile">Profile</Link>
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
                        <Link className={classes.linkText} to="/login/">Login</Link>
                    </li>
                    <li>
                        <Link className={classes.linkText} to="/register/">Register</Link>
                    </li>
                </React.Fragment>
            )
        }

        return (
            <div className="navBar">
                <button className="btn-right" onClick={this.Toggle}>
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