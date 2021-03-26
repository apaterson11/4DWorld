import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ProfileCard from "./ProfileCard";
import ProjectContainer from "../Project/ProjectContainer";
import DropFileContainer from "../Project/DropFileContainer";
import UserGroupsCard from "./UserGroupsCard";
import { IsAuthenticated, UserContext } from "../../Context";
import Spinner from "../Spinner";

const useStyles = makeStyles({
  pad: {
    paddingLeft: "20px",
    paddingRight: "20px",
    minHeight: "93vh",
  },
  profile: {
    paddingLeft: "20px",
    paddingRight: "20px",
    minHeight: "93vh",
    background: "#002e5b",
  },
});

function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { isAuthenticated, setIsAuthenticated } = useContext(IsAuthenticated);

  useEffect(() => {
    if (userDetails === undefined) {
      const details = JSON.parse(localStorage.getItem("userDetails"));
      if (!details) {
        history.push("/login");
      }
      setUserDetails(details);
      setIsAuthenticated(true);
    }
  }, [userDetails]);

  return (
    <>
      {userDetails == undefined ? (
        <Spinner />
      ) : (
        <Grid container component="main">
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            className={classes.profile}
            component={Paper}
            square
          >
            <Grid item xs={12}>
              <ProfileCard />
            </Grid>
            <Grid item xs={12}>
              <UserGroupsCard />
            </Grid>

            <Grid item xs={12}>
              <DropFileContainer />
            </Grid>
          </Grid>
          <Grid
            item
            wrap="wrap"
            xs={12}
            sm={6}
            md={8}
            component={Paper}
            className={classes.pad}
          >
            <ProjectContainer />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default Dashboard;
