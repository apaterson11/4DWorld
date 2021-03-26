import React, {Component} from "react";
import { Papa } from "papaparse";
import { makeStyles } from '@material-ui/core/styles'
import { ClassNames } from "@emotion/core";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import axiosInstance from "../../axios";
import Box from '@material-ui/core/Box';

{/*{email: "fake@gmail.com", name: "fake"}*/};
//
export default class DropFileContainer extends React.Component {
  state = {
    students: [],
    data: [],
    
  }; 
  

  // const classes = useStyles();
  // const [students, setStudents] = React.useState([
  // {/*GUID: "1234567", First: "john", Last: "doe", Email: "test@email.com", Role: "manager", Status:"Active"*/}
  // ]);

  // first half of image uploading
  fileSelectedHandler = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
    });
  };

  // Parse CSV file 
  parseFile = () => {
      let updates = [];
      console.log(this.state.selectedFile, "file");
      var Papa = require("papaparse/papaparse.min.js");
      Papa.parse(this.state.selectedFile, {
        delimiter: "",
        chunkSize: 3,
        header: false,
        skipEmptyLines: true,
        complete: (responses) => {
          console.log(responses.data.slice(1));
          this.setState({data: responses.data})
        }
      });

      data.forEach((line) => {
        username = line[2].split('@')[0];

        axiosInstance.post('register/', {
          firstname: line[0]
          lastname: line[1] 
          email: line[2],
          password: this.state.password //Either GUID/Email for passsword?
      })
      })
  
  };



  // Input CSV file 
  render() {
    return (

      // <div className={classes.paper}>
          
          <Card>
            <CardContent>

              <Typography gutterBottom variant="h4" component="h2">
                  CSV File Import
              </Typography>

              <div>
              
           
              <Box>
                {/* <Typography variant="h6" component="h2" color="primary" align="center">
                  Drop File Here
                </Typography> */}

                  {/* upload image button */}
                  <input type="file" onChange={this.fileSelectedHandler} required />
                  <button
                    disabled={!this.state.selectedFile}
                    onClick={this.parseFile}
                  >
                    Upload
                  </button>
              </Box>
  
              </div>

              

              <ul>
                  {this.state.students.map((s) => (
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
      // </div> 


    );
}
}
