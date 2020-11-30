import React, {useState} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Header from './components/Header'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import ProtoMap from './components/ProtoMap'

class App extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      defaultLat: "55.86515",
      defaultLon: "-4.25763",
      isAuthenticated: false
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
            <Route exact path="/login/" render={() => (
              <Login login={this.login}/>
            )} />
            <Route path="/logout/" render={() => (
              <Logout logout={this.logout}/>
            )} />
          </Switch>
        </React.StrictMode>
      </Router>
    ); }
}

export default App;
