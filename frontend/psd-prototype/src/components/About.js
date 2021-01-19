import React from 'react'
import axiosInstance from '../axios'
import { Button, Container, CssBaseline, Grid, Typography, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const styles = theme => ({
    paper: {
        marginTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
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
});

