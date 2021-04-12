import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import axiosInstance from "../../axios";
import MUIDataTable from "mui-datatables";
import { Autocomplete } from "@material-ui/lab";
import Grid from "@material-ui/core/Grid";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  pad: {
    paddingTop: "30px",
    paddingBottom: "30px",
  },
  btn: {
    margin: "10px",
  },
});

export default function AddUsersToGroupModal(props) {

  const classes = useStyles();
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newMember, setNewMember] = useState(null);
  const columns = ["Email", "Name", "Surname", "Username"];
  const options = {
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 20],
    onRowsDelete: (rowsDeleted) => {
      const membersClone = [...members];
      const indices = rowsDeleted.data.map((d) => d.dataIndex);
      let requests = [];
      for (let idx of indices) {
        const userId = membersClone[idx][4];
        requests.push(
          axiosInstance.delete(`/groups/${props.groupID}/user/${userId}/`)
        );
      }
      Promise.all(requests).then((res) => {
        // sort the indices from highest to lowest
        // this prevents slicing error
        indices.sort(function (a, b) {
          return parseInt(b) - parseInt(a);
        });
        for (let idx of indices) {
          membersClone.splice(idx, 1);
        }
        setMembers(membersClone);
        props.userDetailsRequest();
      });
    },
  };

  const addToGroup = (e) => {
    if (newMember !== null) {
      axiosInstance
        .post(`/groups/${props.groupID}/user/${newMember.id}/`) // adds new user to the group via a post Request
        .then((res) => {
          const newMembers = [...members];
          newMembers.push([
            newMember.user.email,
            newMember.user.first_name,
            newMember.user.last_name,
            newMember.user.username,
            newMember.user.id,
          ]);
          setMembers(newMembers);
          props.userDetailsRequest();
          setNewMember(null);
        });
    }
  };

  const updateUserOptions = () => {
    axiosInstance.get("/user-details").then((userResponse) => {
      let allUsers = userResponse.data;
      // filter out all existing group members from the options
      for (let user of members) {
        allUsers = allUsers.filter((u) => u.user.email !== user[0]);
      }
      setAllUsers(allUsers);
    });
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
      });
    }
  }, [props.open]);

  useEffect(() => {
    updateUserOptions();
  }, [members]);


  //Displays Add Users Dialog
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
          <Grid
            container
            component="main"
            className={classes.pad}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Grid item xs={8} md={6}>
              <Autocomplete
                id="user-combobox"
                label="New Member"
                options={allUsers}
                getOptionLabel={(option) => option.user.email}
                size="small"
                fullWidth
                value={newMember}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="New Member"
                    variant="outlined"
                    margin="dense"
                  />
                )}
                onChange={(e, value) =>
                  value ? setNewMember(value) : setNewMember(null)
                }
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                className={classes.btn}
                onClick={addToGroup}
                variant="contained"
                color="primary"
                size="small"
              >
                Add to group
              </Button>
            </Grid>
          </Grid>
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
