import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import axiosInstance from "../../axios";
import EditGroupsCardModal from "./EditGroupsCardModal";
import AddUsersToGroupModal from "./AddUsersToGroupModal";
import { UserContext } from "../../Context";
import MUIDataTable from "mui-datatables";

const useStyles = makeStyles({
  root: {
    minWidth: "90%",
  },
  paper: {
    marginTop: "20px",
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default function UserGroupsCard() {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupClicked, setGroupClicked] = useState();
  const [groupOpen, setGroupOpen] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);
  const columns = ["Name", "Members"];

  const userDetailsRequest = () =>
    axiosInstance
      .get(`/user-details/${userDetails.profile_id}`) 
      .then((response) => {
        const userGroups = response.data.user.groups.filter(
          (grp) => grp.id !== userDetails.default_group
        );
        setGroups(userGroups);
      });

  useEffect(() => {
    userDetailsRequest();
  }, []);

  useEffect(() => {
    const data = groups.map((grp) => {
      return [grp.name, grp.user_count, grp.id];
    });
    setData(data);
  }, [groups]);

  const handleSubmit = (newGroup) => {
    if (newGroup.name.length !== 0) {
      axiosInstance
        .post(`/groups/`, {
          name: newGroup.name,
        }) // Post request for new group
        .then((response) => {
          let groupsClone = [...groups];
          groupsClone.push(response.data);
          setGroups(groupsClone);
          userDetailsRequest();
          setOpen(false);
        });
    }
  };

  const options = {
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    rowsPerPage: 3,
    rowsPerPageOptions: [],
    onRowsDelete: (rowsDeleted) => {
      const groupsClone = [...groups];
      const indices = rowsDeleted.data.map((d) => d.dataIndex);
      let requests = [];
      for (let idx of indices) {
        const groupId = groupsClone[idx].id;
        requests.push(axiosInstance.delete(`/groups/${groupId}`)); //Removes group that has been selected via GroupID
      }
      Promise.all(requests).then((res) => {
        // sort the indices from highest to lowest
        // this prevents slicing error
        indices.sort(function (a, b) {
          return parseInt(b) - parseInt(a);
        });
        for (let idx of indices) {
          groupsClone.splice(idx, 1);
        }
        setGroups(groupsClone);
      });
    },
    onRowClick: (rowData, rowMeta) => {
      setGroupClicked(data[rowMeta.dataIndex][2]);
      setGroupOpen(true);
    },
  };

  // Displays Edit Group model and Add Users to group model, lists current groups
  return (
    <>
      <EditGroupsCardModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />
      <AddUsersToGroupModal
        open={groupOpen}
        userDetailsRequest={userDetailsRequest}
        groupID={groupClicked}
        onClose={() => setGroupOpen(false)}
      />
      <div className={classes.paper}>
        <Card className={classes.root}>
          <CardContent>
            <MUIDataTable
              title="My Groups"
              data={data}
              columns={columns}
              options={options}
            />
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={() => setOpen(true)}>
              Create a new group
            </Button>
          </CardActions>
        </Card>
      </div>
    </>
  );
}
