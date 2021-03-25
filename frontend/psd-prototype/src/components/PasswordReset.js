import React, {Component, useState, useEffect } from 'react'
import axiosInstance from '../axios';


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
        console.log(this.state);
        let input = {};
        input["email"] = "";
        input["password"] = "";
        input["password2"] = "";
        this.setState({input:input});
        alert('Valid');
    }
  }
  

  // Validates email address is in the right format = exists
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
  
      if (!input["email"]) {
        isValid = false;
        errors["email"] = "Please enter a valid email Address.";
      }
  
      if (typeof input["email"] !== "undefined") {
          
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(input["email"])) {
          isValid = false;
          errors["email"] = "Please enter a valid email address.";
        }
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
            <label for="email">Email Address:</label>
            <input 
              type="text" 
              name="email" 
              value={this.state.input.email}
              onChange={this.handleChange}
              class="form-control" 
              placeholder="Enter email" 
              id="email"
              required
               />
              <div className="text-error">{this.state.errors.email}</div>
              </div>

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



//     onSubmit(e) {
//         e.preventDefault();
//         var email = this.email;
//         alert(email.value)
//         console.log('this is' , email.value)
//     }

//     render(){
//     return (
//         <div className='container mt-5'>
//             <h1>Request password Reset:</h1>
//             <form>
//                 <div className='form-group'>
//                     <input
//                    className= 'form-control'
//                    ref={(c) => this.email = c}
//                    type='email'
//                    placeholder='email'
//                    name='email'
//                    required
//                     />
//                 </div>
//                 <button type="button" onClick={this.onSubmit}>Submit</button>
//             </form>
//         </div>
//     ); 
//   }
// }
// }
