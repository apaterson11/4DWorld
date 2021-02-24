import React from 'react'
import '../App.css';
import './Footer.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'


class Footer extends React.Component{

    // Constructor for the Footer
    constructor(props){
        super(props)

        this.state={
            toggle: false,
        }

    }

    // Cahnges the state of 'toggle' on call to the opp bool value
    Toggle = () => {
        this.setState({
            toggle: !this.state.toggle
        })
    } 

    render(){

        const {classes} = this.props

        let navLinks;

        if(this.props.isAuthenticated)
        {        
            navLinks = ( 
            <React.Fragment>
                <li><Link className={"link-items"} to="/">Home</Link></li>              
                <li><Link className={"link-items"} to="/profile">Dashboard</Link></li>    
                <li><Link className={"link-items"} to="/logout/">Logout</Link></li>
            </React.Fragment>
            )
        }
        else
        {
            navLinks = (
            <React.Fragment>
                <li><Link className={"link-items"} to="/">Home</Link></li>
                <li><Link className={"link-items"} to="/login/">Login</Link></li>
                <li><Link className={"link-items"} to="/register/">Register</Link></li>
                

            </React.Fragment>
            )
        }

        return(

            <div className={"footer-container"}>
                
                <div className={"footer-text-heading"}>
                    <h3>Connect</h3>
                    { navLinks }
                    <br />
                </div>
            </div>

        )


    } 
}

export default Footer;