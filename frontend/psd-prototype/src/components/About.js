import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography';
import axiosInstance from '../axios'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';

import TextCard from './TextCard';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
        
      height: 200,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }));
  
  export default function SpacingGrid() {
    const [spacing, setSpacing] = React.useState(2);
    const classes = useStyles();
  
  
    return (
    //   <Grid container className={classes.root} spacing={2} justify="center">
    //     <Grid item xs={"auto"}>
    //       <Grid container justify="center" spacing={spacing}>
    //         {[0, 1, 2, 3].map((value) => (
    //           <Grid key={value} item>
                <TextCard 
                header="Hello World"
                subheader="minimum styling subheader"
                body="This is the body of the text, test"/>
    //           </Grid>
    //         ))}
    //       </Grid>
    //     </Grid>
        
    //   </Grid>
    );
  }