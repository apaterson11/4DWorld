import React from "react";
import { parse } from "papaparse";
import { makeStyles } from '@material-ui/core/styles'
import { ClassNames } from "@emotion/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  root: {
    height: '125px',
    minWidth: "90%"
  },
  paper: {
    marginTop: '50px',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
      marginTop: '50px',
      marginLeft: '40px'
  },
  row: {
      display: 'flex',
      verticalAlign: 'middle'
  },
  padding: {
      margin: '40px 50px 10px 50px',
  },
  largeIcon: {
      width: 45,
      height: 45,
  },
  dropHere:{
    textAlign: 'middle',
    verticalAlign: 'middle'  
  }
});

{/*{email: "fake@gmail.com", name: "fake"}*/};

export default function DropFileContainer() {
  

  const classes = useStyles();
  const [students, setStudents] = React.useState([
  {/*GUID: "1234567", First: "john", Last: "doe", Email: "test@email.com", Role: "manager", Status:"Active"*/}
  ]);


  return (

    <React.Fragment>

    <div className={classes.paper}>
        
        <Card className={classes.root}>
          <CardContent>

            <Typography gutterBottom variant="h4" component="h2">
                CSV File Import
            </Typography>

            <div       
                onDragOver={(e) => {
                    e.preventDefault();
                }}

                onDrop={(e) => {
                    e.preventDefault();

                    {/*console.log(e.dataTransfer.files)*/};

                    Array.from(e.dataTransfer.files)
                    .forEach(async (file) => {
                        const text = await file.text();
                        const result = parse(text, {header:true})
                        console.log(result)

                        setStudents(existing => [...existing, ...result.data]);

                    });
                }}                     
            >
            
            <Box border={2} borderRadius={16} borderColor="primary.main">
              <Typography variant="h6" component="h2" color="primary" align="center">
                Drop File Here
              </Typography>
            </Box>
 
            </div>

            <ul>
                {students.map((s) => (
                <li key={s.GUID}>
                    <strong>{s.GUID}</strong>{s.First} {s.Last} {s.Email} {s.Role} {s.Status}
                    {s.Group1} {s.Group2} {s.Group3}
                    {s.Project1} {s.Project2} {s.Project3}
                </li>
                ))}
            </ul>


            {/*
            <ul>
                {students.map((student) => (
                <li key={student.email}>
                    <strong>{student.name}</strong>: {student.email}
                    {student.GUID}
                </li>
                ))}
            </ul>
                */}

          </CardContent>
        </Card>
    </div> 

  </React.Fragment>

  );
}