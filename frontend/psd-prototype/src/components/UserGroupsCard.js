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
    minWidth: '90%'
  },
  paper: {
    marginTop: '50px',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
});

export default function UserGroupsCard(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
        <div className={classes.paper}>
            <Card className={classes.root}>
                <CardActionArea>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    My Groups
                    </Typography>
                    <TableContainer>
                        <Table size="small">
                            <TableBody>
                                <TableRow key="name">
                                    <TableCell component="th" scope="row">
                                        CS23
                                    </TableCell>
                                    <TableCell align="right">5 members</TableCell>
                                </TableRow>
                                <TableRow key="email">
                                    <TableCell component="th" scope="row">
                                        Testing
                                    </TableCell>
                                    <TableCell align="right">3 members</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                </CardActionArea>
                <CardActions>
                <Button size="small" color="primary">
                    Create a new group
                </Button>
                </CardActions>
            </Card>
        </div>
    </React.Fragment>
  );
}
