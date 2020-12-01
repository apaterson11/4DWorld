import React from 'react'
import axiosInstance from '../axios'
import { Button, Container, CssBaseline, Grid, Typography, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
    paper: {
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%',
        marginTop: '20px'
    },
    submit: {
        marginTop: '20px',
        marginBottom: '20px',
        backgroundColor: '#002e5b',
        color: 'white'
    },
});

class Register extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            email: '',
            password: '',
            password_confirm: '',
            isDisabled: true,
            emailHasError: false,
            emailHelpText: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        if (this.state.password !== this.state.password_confirm) {
            return
        }

        axiosInstance.post('register/', {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }).then(res => this.props.history.push('/login'))
    }

    handleChange = (e) => {
        const value = e.target.value.trim()
        this.setState({
            [e.target.name]: value
        })

        if (e.target.name == 'email') {
            this.emailValidate(value)
        }
    }

    emailValidate = (value) => {
        if (value.indexOf('@') != -1) {
            axiosInstance.post('/ajax/check_email/', {email: value}).then(res => {
                // check the return data and inform user if email is taken
                if (res.data.exists) {
                    this.setState({
                        emailHasError: true,
                        emailHelpText: 'This email is already taken'
                    })
                } else {
                    this.setState({
                        emailHasError: false,
                        emailHelpText: ''
                    })
                }
            })
        } else {
            this.setState({
                emailHasError: true,
                emailHelpText: ''
            })
        }
    }

    disableSubmit = () => {
        // check valid email
        // check username contains no spaces
        const no_username = this.state.username.length === 0
        const has_spaces = this.state.username.split(" ").length > 1

        // check passwords match
        const no_pw = this.state.password.length < 4
        const no_pw_match = this.state.password != this.state.password_confirm
        return no_username || has_spaces || no_pw || no_pw_match || this.state.emailHasError
    }

    render() {
        const {classes} = this.props
        const disableSubmitBtn = this.disableSubmit()
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>

                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    error={this.state.emailHasError}
                                    helperText={this.state.emailHelpText}
                                    required 
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    name="email"
                                    onChange={this.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required 
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoComplete="username"
                                    name="username"
                                    onChange={this.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required 
                                    fullWidth
                                    type="password"
                                    id="password"
                                    label="Password"
                                    autoComplete="password"
                                    name="password"
                                    onChange={this.handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required 
                                    fullWidth
                                    type="password"
                                    id="password_confirm"
                                    label="Confirm Password"
                                    autoComplete="password_confirm"
                                    name="password_confirm"
                                    onChange={this.handleChange}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            className={classes.submit}
                            onClick={this.handleSubmit}
                            disabled={disableSubmitBtn}
                        >Sign Up</Button>

                        <Grid container justify='center'>
                            <Grid item>
                                <Link to='/login'>
                                    Already have an account? Sign in!    
                                </Link>    
                            </Grid>    
                        </Grid> 
                    </form>
                </div>
            </Container>
        )
    }
}

export default withStyles(styles)(Register)