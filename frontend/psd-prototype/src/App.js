import React, {useState} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Header from './components/Header'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import ProtoMap from './components/ProtoMap'
import About from './components/About'
//import Projects from './components/Projects'
import axiosInstance from './axios'

class App extends React.Component {
  
  // This sets the default map to be Glasgow city
  constructor(props) {
    super(props)
    this.state = {
      defaultLat: "55.86515",
      defaultLon: "-4.25763",
      isAuthenticated: false
    }
  }

  componentDidMount() {
    // On the App component mounting, check to see if user logged in already
    const token = localStorage.getItem('access_token')
    if (token) {
      // verify token is correct
      axiosInstance.post('token/refresh/', {refresh: localStorage.getItem('refresh_token')}).then((res) => {
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
          this.setState({isAuthenticated: true})
      }).catch((err) => {
        console.log(err)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
    }
  }

  login = () => {
    this.setState({isAuthenticated: true})
  }

  logout = () => {
    this.setState({isAuthenticated: false})
  }

  render() {
    return (
      <Router>
        <React.StrictMode>
          <Header isAuthenticated={this.state.isAuthenticated} />
          <Switch>
            <Route exact path="/" render={() => (
              <ProtoMap latitude={this.state.defaultLat} longitude={this.state.defaultLon}/>
            )} />
            <Route exact path="/register/" component={Register}/>
            <Route exact path ="/about/" component={About}/>
            <Route exact path="/login/" render={() => (
              <Login login={this.login}/>
            )} />
            <Route path="/logout/" render={() => (
              <Logout logout={this.logout}/>
            )} />
          </Switch>
        </React.StrictMode>
      </Router>
    );
  }
}

export default App;
