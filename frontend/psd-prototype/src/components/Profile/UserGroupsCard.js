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
    marginTop: "50px",
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
          (grp) => grp.id != userDetails.default_group
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
    axiosInstance
      .post(`/groups/`, {
        name: newGroup.name,
      })
      .then((response) => {
        let groupsClone = [...groups];
        groupsClone.push(response.data);
        setGroups(groupsClone);
        setOpen(false);
      });
  };

  const options = {
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    rowsPerPage: 3,
    rowsPerPageOptions: false,
    onRowsDelete: (rowsDeleted) => {
      rowsDeleted.data.map((d) => {
        const deleteId = data[d.dataIndex][2];
        axiosInstance.delete(`/groups/${deleteId}`).then((res) => {
          const newGroups = groups.filter((grp) => grp.id !== deleteId);
          setGroups(newGroups);
        });
      });
    },
    onRowClick: (rowData, rowMeta) => {
      setGroupClicked(data[rowMeta.dataIndex][2]);
      setGroupOpen(true);
    },
  };

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
        onSubmit={() => console.log("submit")}
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
