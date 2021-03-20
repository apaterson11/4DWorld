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
import { Autocomplete } from "@material-ui/lab";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddUsersToGroupModal(props) {
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newMember, setNewMember] = useState([]);
  const columns = ["Email", "Name", "Surname", "Username"];
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
          return [
            member.email,
            member.first_name,
            member.last_name,
            member.username,
            member.id,
          ];
        });
        setMembers(memberData);
        axiosInstance.get("/user-details").then((userResponse) => {
          let allUsers = userResponse.data;
          // filter out all existing group members from the options
          for (let user of response.data.members) {
            allUsers = allUsers.filter((u) => u.user.email !== user.email);
          }
          setAllUsers(allUsers);
        });
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
        <DialogContent>
          <MUIDataTable
            title="Members"
            data={members}
            columns={columns}
            options={options}
          />
          <Autocomplete
            margin="normal"
            id="user-combobox"
            label="New Member"
            options={allUsers}
            getOptionLabel={(option) => option.user.email}
            size="small"
            fullWidth
            renderInput={(params) => (
              <TextField
                {...params}
                label="New Member"
                variant="outlined"
                margin="dense"
              />
            )}
            onChange={(e, value) =>
              value ? setNewMember(value.id) : setNewMember(null)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
