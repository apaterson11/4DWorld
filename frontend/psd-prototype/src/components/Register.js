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
            emailHelpText: '',
            usernameHasError: false,
            usernameHelpText: '',
            passwordHasError: false,
            passwordHelpText: '',
            passwordMismatch: false,
            mismatchHelpText: ''
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
        else if (e.target.name == 'username') {
            this.usernameValidate(value)
        }
        else if (e.target.name == 'password') {
            this.validatePassword(value)
        }
        else if (e.target.name == 'password_confirm') {
            this.checkPasswordsMatch(value)
        }
    }

    emailValidate = (value) => {
        if (value.indexOf('@') != -1) {
            axiosInstance.post('/ajax/check_email/', {email: value}).then(res => {
                const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let lenAfterAt = value.length - value.indexOf('@')

                // check email provided is of a right format
                if (!pattern.test(value)) {
                    this.setState({
                        emailHasError: true,
                        emailHelpText: (lenAfterAt > 4) ? 'This is not a valid email' : ''
                    })
                }
                // check the return data and inform user if email is taken
                else if (res.data.exists) {
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

    usernameValidate = (value) => {
        let hasSpaces = value.split(" ").length > 1
        if (hasSpaces) {
            this.setState({
                usernameHasError: true,
                usernameHelpText: 'Username should not contain spaces'
            }) 
        } else {
            axiosInstance.post('/ajax/check_username/', {username: value}).then(res => {
                if (res.data.exists) {
                    this.setState({
                        usernameHasError: true,
                        usernameHelpText: 'This username is already taken'
                    })
                } else {
                    this.setState({
                        usernameHasError: (value.length > 0) ? false : true,
                        usernameHelpText: ''
                    })
                }
            })
        }
    }

    validatePassword = (value) => {
        if (value.length < 4) {
            this.setState({
                passwordHasError: true,
                passwordHelpText: (value.length > 0) ? 'Password is too short' : ''
            })
        } else {
            this.setState({
                passwordHasError: false,
                passwordHelpText: ''
            })
        }
    }

    checkPasswordsMatch = (value) => {
        if (value != this.state.password) {
            this.setState({
                passwordMismatch: true,
                mismatchHelpText: (value.length > 0) ? 'Passwords do not match' : ''
            })
        } else {
            this.setState({
                passwordMismatch: false,
                mismatchHelpText: ''
            })
        }
    }

    disableSubmit = () => {
        // check all fields entered
        const noEmail = this.state.email.length === 0
        const noUsername = this.state.username.length === 0
        const noPassword = this.state.password.length === 0
        const noConfirmPassword = this.state.password_confirm.length === 0
        
        return noEmail || noUsername || noPassword || noConfirmPassword || 
            this.state.emailHasError || this.state.usernameHasError ||
            this.state.passwordHasError || this.state.passwordMismatch
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
                                    error={this.state.usernameHasError}
                                    helperText={this.state.usernameHelpText}
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
                                    error={this.state.passwordHasError}
                                    helperText={this.state.passwordHelpText}
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
                                    error={this.state.passwordMismatch}
                                    helperText={this.state.mismatchHelpText}
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