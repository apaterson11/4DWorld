import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextCard from "./TextCard";
import Footer from "./Footer";
import { IsAuthenticated } from "../Context";

require("./About.css");

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 200,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));

export default function SpacingGrid() {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();
  const { isAuthenticated, setIsauthenticated } = useContext(IsAuthenticated);

  return (
    //   <Grid container className={classes.root} spacing={2} justify="center">
    //     <Grid item xs={"auto"}>
    //       <Grid container justify="center" spacing={spacing}>
    //         {[0, 1, 2, 3].map((value) => (
    //           <Grid key={value} item>
    <React.Fragment>
      <h1>4DWorld</h1>
      <h3>Not much to see here... go get started!</h3>
    </React.Fragment>
    // 
    //   <TextCard
    //     header="Hello World"
    //     subheader="minimum styling subheader"
    //     body="This is the body of the text, test"
    //   />
    //   <Footer isAuthenticated={isAuthenticated} />
    // </>
    //           </Grid>
    //         ))}
    //       </Grid>
    //     </Grid>

    //   </Grid>
  );
}
