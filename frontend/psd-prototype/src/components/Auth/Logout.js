import React from "react";
import axiosInstance from "../../axios";
import { withRouter } from "react-router-dom";

class Logout extends React.Component {
  componentDidMount() {
    const response = axiosInstance.post("logout/blacklist/", {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("userDetails");
    axiosInstance.defaults.headers["Authorization"] = null;
    this.props.logout();
    this.props.history.push("/login");
  }

  render() {
    return <div>Logout</div>;
  }
}

export default withRouter(Logout);
