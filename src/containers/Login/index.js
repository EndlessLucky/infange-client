import React, { Component, Fragment } from "react";
import { login, resendRequest, resetpwdreq } from "../../helpers/api/index";
import Login from "../../components/Login";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  paper: {
    margin: 0,
    position: "absolute",
    width: "350px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: theme.spacing(3)
  },
  flex: {
    width: "290px",
    margin: "auto"
  },
  button: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(3),
    width: "100%",
    maxWidth: 250
  }
});

class LoginUser extends Component {
  state = {
    username: "",
    password: "",
    isLoading: false,
    error: null,
    resend: false,
    onSucess: false,
    reset: false,
    resendmsg: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, error: null });
  };

  handleLogin = async () => {
    const { username, password } = this.state;

    this.setState({ isLoading: true });
    login({ username, password })
      .then(data => {
        console.log(data);
        localStorage.setItem("user", username);
        this.props.history.push("/");
      })
      .catch(err => {
        console.log("errr", err);
        if (err.data) {
          this.setState({ error: err.data.message });
          if (err.data.message === "Email not verified")
            this.setState({ resendmsg: true });
        }
        this.setState({ isLoading: false });
      });
  };
  handleResendRequest = async (event, back = false) => {
    if (back) {
      this.setState({
        resend: false
      });
      return;
    }
    const username = this.state.username;
    if (this.state.resend) {
      if (username === "") this.setState({ error: "Enter your username" });
      else {
        this.setState({ isLoading: true });
        resendRequest({ username })
          .then(response => {
            this.setState({ isLoading: false, onSucess: true });
          })
          .catch(err => {
            this.setState({ error: err.data.message, isLoading: false });
          });
      }
    } else this.setState({ resend: true, error: false });
  };

  handleResetRequest = async (event, back = false) => {
    if (back) {
      this.setState({
        reset: false
      });
      return;
    }
    if (this.state.reset) {
      const username = this.state.username;
      if (username === "") this.setState({ error: "Enter your username" });
      else {
        this.setState({ isLoading: true });
        resetpwdreq(`username=${username}`)
          .then(response => {
            this.setState({ isLoading: false, onSucess: true });
          })
          .catch(err => {
            this.setState({ error: err.data.message, isLoading: false });
          });
      }
    } else this.setState({ reset: true, error: false });
  };

  handleClose = async () => {
    this.setState({ onSucess: false, reset: false, resend: false });
  };

  render() {
    const { username, password, isLoading, error } = this.state;
    return (
      <Fragment>
        <Login
          username={username}
          password={password}
          isLoading={isLoading}
          onChange={this.handleChange}
          onSubmit={this.handleLogin}
          onResendRequest={this.handleResendRequest}
          error={error}
          resend={this.state.resend}
          onSucess={this.state.onSucess}
          handleClose={this.handleClose}
          reset={this.state.reset}
          onResetRequest={this.handleResetRequest}
          resendmsg={this.state.resendmsg}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(LoginUser);
