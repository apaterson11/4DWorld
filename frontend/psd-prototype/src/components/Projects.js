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

class Projects extends React.Component {


  render() {
    return (
        <div class="grid-container">
            <div class="title">
                <h1><center>Work in Progress</center></h1>
            </div>
        </div>
    );
  }
}

  

export default withRouter( (withStyles(styles)(Projects)) )