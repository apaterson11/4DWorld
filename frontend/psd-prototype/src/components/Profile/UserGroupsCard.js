import React, { useEffect, useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import axiosInstance from "../../axios";
import EditGroupsCardModal from "./EditGroupsCardModal";
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
  const [open, setOpen] = useState(false);
  const { userDetails, setUserDetails } = useContext(UserContext);

  useEffect(() => {
    axiosInstance
      .get(`/user-details/${userDetails.profile_id}`)
      .then((response) => {
        setGroups(response.data.user.groups);
      });
  }, []);

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

  const columns = ["Name", "Members"];
  const data = groups.map((group) => {
    return [group.name, group.user_count];
  });
  const options = {
    download: false,
    print: false,
    viewColumns: false,
    elevation: 0,
    rowsPerPage: 3,
    rowsPerPageOptions: false,
  }; // onRowClick, onRowsDelete

  return (
    <>
      <EditGroupsCardModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
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
