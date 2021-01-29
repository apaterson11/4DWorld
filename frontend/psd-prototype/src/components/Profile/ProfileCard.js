import React, {useState} from 'react';
import axiosInstance from '../../axios'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import EditProfileModal from './EditProfileModal'


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

export default function ProfileCard(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    newName: props.userDetails.name,
    newEmail: props.userDetails.email,
    newDepartment: props.userDetails.department
  })

  const handleSubmit = () => {
    const response = axiosInstance.put(`/user-details/${props.userDetails.profile_id}/`,
      {
        user: {
          first_name: newProfile.newName,
          email: newProfile.newEmail,
        },
        department: newProfile.newDepartment
      })
      .then(response => {
        props.setUserDetails({
          ...props.userDetails,
          name: response.data.user.first_name,
          email: response.data.user.email,
          department: response.data.department
        })
        setOpen(false);
      })
  }

  return (
    <React.Fragment>
        <EditProfileModal 
          open={open} 
          userDetails={props.userDetails}
          onClose={() => setOpen(false)} 
          onSubmit={handleSubmit} 
          newProfile={newProfile}
          setNewProfile={setNewProfile}
        />
        <div className={classes.paper}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                    { props.userDetails.username }
                    </Typography>
                    <TableContainer>
                        <Table size="small">
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
                <CardActions>
                <Button size="small" color="primary" onClick={() => setOpen(true)}>
                    Edit Profile
                </Button>
                </CardActions>
            </Card>
        </div>
    </React.Fragment>
  );
}