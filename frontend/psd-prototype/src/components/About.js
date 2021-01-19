import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';




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

class About extends React.Component {


  render() {
    return (
        <div class="grid-container">
            <div class="title">
                <h1><center>About</center></h1>
            </div>
            <div class="content"></div>
                <h3>(To be named map app) is a project created by team CS23 for University of Glasgow's College of Arts.
                </h3>
        </div>
      //      <Typography component="h1" variant="h3">
      //          <center>About</center>
      //      </Typography>
                
    );
  }
}

  

export default withRouter( (withStyles(styles)(About)) )
