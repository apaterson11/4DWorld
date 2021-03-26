import React, {Component, useState, useEffect } from 'react'
import axiosInstance from '../axios';

//Seperate then passwordResetRequest because you need a token. Will have to send an email
//NB will delete this comment when it's done 

class ResetPassword extends React.Component {
    constructor() {
    super();
    this.state = {
      input: {},
      errors: {}
    };
     
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
     
  handleChange(event) {
    let input = this.state.input;
    input[event.target.name] = event.target.value;
  
    this.setState({
      input
    });
  }
    
  handleSubmit(event) {
    event.preventDefault();
    if(this.validate()){
        let input = {};
        input["password"] = "";
        input["password2"] = "";
        this.setState({input:input});
    }
  }


  // checks if password1 and two are the same 
  validate(){
      let input = this.state.input;
      let errors = {};
      let isValid = true;

      var password = document.getElementById("password").value;
      var password2 = document.getElementById("password2").value;

      if (!input["password"]){
          isValid = false;
          errors["password"] = "Please enter a new password";
      }

      if (!input["password2"]){
        isValid = false;
        errors["password2"] = "Please confirm password";
    }

    if (password != password2){
        isValid = false;
        errors["password2"] = "That does not match";
    }

      this.setState({
        errors: errors
      });      
      return isValid;
  }
     
  render() {
    return (
      <div>
        <h1>Reset Password Request</h1>
        <form onSubmit={this.handleSubmit}> 

            <div class="form-group">
            <label for="Password">New Password:</label>
            <input 
              type="text" 
              name="password" 
              value={this.state.input.password}
              onChange={this.handleChange}
              class="form-control" 
              placeholder="New password" 
              id="password" />
  
              <div className="text-error">{this.state.errors.password}</div>
              </div>

              <div class="form-group">
            <label for="Password2">Confirm Password:</label>
            <input 
              type="text" 
              name="password2" 
              value={this.state.input.password2}
              onChange={this.handleChange}
              class="form-control" 
              placeholder="Confirm password" 
              id="password2" />
  
              <div className="text-error">{this.state.errors.password2}</div>
              </div>


          <button type="submit" value="Submit" class="btn btn-success">Submit</button>
        </form>
      </div>
    );
  }
}
  
export default ResetPassword;