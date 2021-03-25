import React, {Component, useState, useEffect } from 'react'
//import axiosInstance from '../../axios';

export default class ResetPassword extends React.Component {

    constructor(props){
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
      }

    onSubmit(e) {
        e.preventDefault();
        var email = this.email;
        alert(email.value)
        //console.log('this is' , email)
    }

    render(){
    return (
        <div className='container mt-5'>
            <h1>Request password Reset:</h1>
            <form>
                <div className='form-group'>
                    <input
                    className= 'form-control'
                    ref={(c) => this.email = c}
                    type='email'
                    placeholder='email'
                    name='email'
                    required
                    />
                </div>
                <button type="button" onClick={this.onSubmit}>Submit</button>
            </form>
        </div>
    );
  }

};