import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  })

export default function EditProfileModal(props) {

  const handleChange = (e) => {
    props.setNewProfile({
      ...props.newProfile,
      [e.target.name]: e.target.value.trim()
    })
  }

  return (
    <div>
      <Dialog 
        open={props.open} 
        onClose={props.onClose} 
        TransitionComponent={Transition}
        maxWidth="xs"
        aria-labelledby="editProfileForm"
      >
        <DialogTitle id="form-dialog-title">Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            name="newName"
            defaultValue={props.userDetails.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            name="newEmail"
            defaultValue={props.userDetails.email}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            id="department"
            label="Department"
            fullWidth
            name="newDepartment"
            defaultValue={props.userDetails.department}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={props.onSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
