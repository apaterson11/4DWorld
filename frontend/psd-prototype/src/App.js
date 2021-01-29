import React, {useState, useEffect} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import About from './components/About'
import Header from './components/Header'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import ProtoMap from './components/ProtoMap'
import Profile from './components/Profile'
import axiosInstance from './axios'
import jwt from 'jwt-decode'

function App(props) {

  const [state, setState] = useState({
    defaultLat: "55.86515",
    defaultLon: "-4.25763",
    isAuthenticated: false,
    userDetails: null
  })

  useEffect(() => {
    // On the App component mounting, check to see if user logged in already
    const token = localStorage.getItem('access_token')
    if (token) {
      // verify token is correct
      axiosInstance.post('token/refresh/', {refresh: localStorage.getItem('refresh_token')}).then((res) => {
          axiosInstance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
          setState({...state, isAuthenticated: true})
      }).catch((err) => {
        console.log(err)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
    }
  }, [])
  
  const login = () => {
    const userData = jwt(localStorage.getItem('access_token'))
    setState({isAuthenticated: true, userDetails: userData})
  }

  const logout = () => {
    setState({isAuthenticated: false})
  }

  return (
    <Router>
        <Header isAuthenticated={state.isAuthenticated} />
        <Switch>
          <Route exact path="/" component={About}/>
          <Route exact path="/demo-map/" render={() => (
            <ProtoMap latitude={state.defaultLat} longitude={state.defaultLon}/>
          )} />
          <Route exact path="/profile/" render={() => (
            <Profile userDetails={state.userDetails}/>
          )} />
          <Route exact path="/register/" component={Register}/>
          <Route exact path="/login/" render={() => (
            <Login login={login}/>
          )} />
          <Route path="/logout/" render={() => (
            <Logout logout={logout}/>
          )} />
  
        </Switch>
    </Router>
  )
}


export default App;
