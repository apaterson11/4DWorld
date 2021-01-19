import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';


const useStyles = makeStyles({
  root: {
    height: '100vh',
    minWidth: "90%"
  },
  paper: {
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

export default function ProfileCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
        <div className={classes.paper}>
            <Card className={classes.root}>
                <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    { props.userDetails.username }
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell component="th" scope="row">
                                        Name
                                    </TableCell>
                                    <TableCell align="right">{props.userDetails.name}</TableCell>
                                </TableRow>
                                <TableRow key="email">
                                    <TableCell component="th" scope="row">
                                        Email
                                    </TableCell>
                                    <TableCell align="right">{props.userDetails.email}</TableCell>
                                </TableRow>
                                <TableRow key="department">
                                    <TableCell component="th" scope="row">
                                        Department
                                    </TableCell>
                                    <TableCell align="right">{props.userDetails.department}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                </CardActionArea>
                <CardActions>
                <Button size="small" color="primary">
                    Edit Profile
                </Button>
                </CardActions>
            </Card>
        </div>
    </React.Fragment>
  );
}
