import React, {useState} from 'react';
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

  const [newGroup, setNewGroup] = useState({name: ''})

  return (
    <div>
      <Dialog 
        open={props.open} 
        onClose={props.onClose} 
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth={true}
        aria-labelledby="addGroupForm"
      >
        <DialogTitle id="form-dialog-title">Create a New Group</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Group Name"
            fullWidth
            name="name"
            onChange={(e) => setNewGroup({name: e.target.value.trim()})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.onSubmit(newGroup)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
