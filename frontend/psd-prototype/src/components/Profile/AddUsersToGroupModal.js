import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import axiosInstance from "../../axios";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUsersToGroupModal(props) {
  const [users, setUsers] = useState();

  useEffect(() => {
    axiosInstance.get(`/groups/${props.groupID}`).then((response) => {
      console.log(response.data);
      // setGroups(response.data.user.groups);
    });
  }, []);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth={true}
        aria-labelledby="addUsersToGroupForm"
      >
        <DialogTitle id="form-dialog-title">Group Members</DialogTitle>
        <DialogContent>Hi</DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => props.onSubmit()} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
