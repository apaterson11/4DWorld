import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import axiosInstance from '../../axios';


const styles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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

  pad: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },

});

class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        username: '',
        password: '',
        isDisabled: true,
        usernameHasError: false,
        usernameHelpText: '',
        passwordHasError: false,
        passwordHelpText: ''
    }
}

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value.trim()
    })
  }

  disableSubmit = () => {
    // check all fields entered
    const noUsername = this.state.username.length === 0
    const noPassword = this.state.password.length === 0
    
    return noUsername || noPassword
}

  handleSubmit = (e) => {
    e.preventDefault()
    
    // send POST request to the JWT token endpoint
    axiosInstance.post('token/', {
      username: this.state.username,
      password: this.state.password
    }).then(response => {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      localStorage.setItem('user', this.state.username)
      axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token')

      this.props.login()
      this.props.history.push("/dashboard")  
    }).catch(err => {
      this.setState({
        passwordHasError: false,
        usernameHasError: false,
        passwordHelpText: '',
        usernameHelpText: ''
      })
      axiosInstance.post('/ajax/check_username/', {username: this.state.username}).then(res => {
        if (err.response.status == 401) {
          if (res.data.exists) {
            // wrong password
            this.setState({
              passwordHasError: true,
              passwordHelpText: 'Incorrect password'
            })
          } else {
            // username does not exist
            this.setState({
              usernameHasError: true,
              usernameHelpText: 'No account is associated with this username'
          })
          }
        }
      })
    })
  }

  render() {
    const {classes} = this.props
    const disableSubmitBtn = this.disableSubmit()
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} className={classes.pad} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                error={this.state.usernameHasError}
                helperText={this.state.usernameHelpText}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={this.handleChange}
              />
              <TextField
                variant="outlined"
                error={this.state.passwordHasError}
                helperText={this.state.passwordHelpText}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.submit}
                onClick={this.handleSubmit}
                disabled={disableSubmitBtn}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  {/* <Link href="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  <Link to='/register'>
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter( (withStyles(styles)(Login)) )