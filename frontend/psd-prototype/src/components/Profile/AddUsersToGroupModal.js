import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import axiosInstance from "../../axios";
import MUIDataTable from "mui-datatables";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUsersToGroupModal(props) {
  const [members, setMembers] = useState([]);
  const columns = ["Email", "First Name", "Username"];
  const options = {
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    onRowsDelete: (rowsDeleted) => {
      rowsDeleted.data.map((d) => {
        console.log(members[d.dataIndex]);
      });
    },
    // onRowClick: (rowData, rowMeta) => {}
  };

  useEffect(() => {
    if (props.open) {
      axiosInstance.get(`/groups/${props.groupID}`).then((response) => {
        const memberData = response.data.members.map((member) => {
          return [member.email, member.first_name, member.username, member.id];
        });
        setMembers(memberData);
      });
    } else {
      setMembers([]);
    }
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth={true}
        aria-labelledby="addUsersToGroupForm"
      >
        <DialogTitle id="form-dialog-title">Group Members</DialogTitle>
        <DialogContent>
          <MUIDataTable
            title="Members"
            data={members}
            columns={columns}
            options={options}
          />
        </DialogContent>
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
