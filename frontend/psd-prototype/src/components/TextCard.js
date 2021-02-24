import React, {useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardContent from '@material-ui/core/CardContent';

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
    root: {
      minWidth: '50%'
    },
    paper: {
      marginTop: '50px',
      marginBottom: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: 5,

    }
  });

  
//class TextCard extends React.Component{
  
function TextCard(props){

    // imlpement passing of data 
    

    const classes = useStyles()

        return(
            <React.Fragment>
                
                <div className={classes.paper}>
                    <Card className={classes.root}>

                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                            {props.header}
                            </Typography>

                            <TableContainer>

                                <Table>
                                    <TableBody>
                                        <TableRow key="card-subheading">
                                            <TableCell component="th" scope="row">
                                                {props.subheader}
                                            </TableCell>                                                 
                                        </TableRow>   
                                    </TableBody>

                                    <br/>

                                    <TableBody>
                                        <TableRow key="card-body">
                                            <TableCell component="th" scope="row">
                                                {props.body}
                                            </TableCell>                                                 
                                        </TableRow>   
                                    </TableBody>

                                    <br/>

                                </Table>
                            </TableContainer>

                        </CardContent>
                        
                    </Card>
                </div>
            </React.Fragment>
                )
    };


export default TextCard