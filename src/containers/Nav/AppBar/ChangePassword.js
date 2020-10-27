import React from "react";
import axios from "axios";
import Save from "../../../components/controls/Button/Save";
import TextBox from "../../../controls/TextField";
import PasswordTextBox from "../../../controls/Password";
import { Error } from "../../../components/controls/Message";
import Box from "../../../components/controls/Box";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class ChangePassword extends React.Component {
  state = {
    userName: null,
    oldPassword: null,
    newPassword: null,
    confirmPassword: null,
    errorMessage: null,
    isChangePassword: false,
    isChangeUserName: true,
    responseSucess: false,
    vertical: "top",
    horizontal: "center",
  };

  handleUserName = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
  };

  handleUserName = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
  };

  handleUserName = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      userName: event.target.value,
    });
  };

  handleOldPassword = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      oldPassword: event.target.value,
    });
  };

  handleNewPassword = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      newPassword: event.target.value,
    });
  };

  handleConfirmPassword = (event) => {
    if (this.state.errorMessage) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      confirmPassword: event.target.value,
    });
  };

  updateUser = () => {
    if (!this.state.userName) {
      this.setState(
        {
          userName: localStorage.getItem("user"),
        },
        () => this.onSave()
      );
    } else {
      this.onSave();
    }
  };

  onSave = async () => {
    if (this.isValid()) {
      await axios
        .post(`/api/Account/Users/reset`, {
          username: this.state.userName,
          password: this.state.oldPassword,
          newPassword: this.state.newPassword,
          confirmpassword: this.state.confirmPassword,
        })
        .then((response) => {
          if (response.status === 200) {
            this.setState({
              responseSucess: true,
            });
            localStorage.setItem("user", this.state.userName);
          }
        })
        .catch((err) => {
          this.setState({
            errorMessage: err.data.message,
          });
        });
    }
  };

  toggleChangeUserName = () => {
    if (
      this.state.isChangeUserName === false &&
      this.state.isChangePassword === true
    ) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      isChangePassword: false,
      isChangeUserName: true,
    });
  };

  toggleChangePassword = () => {
    if (
      this.state.isChangeUserName === true &&
      this.state.isChangePassword === false
    ) {
      this.setState({
        errorMessage: null,
      });
    }
    this.setState({
      isChangePassword: true,
      isChangeUserName: false,
    });
  };

  isValid = () => {
    if (this.state.isChangeUserName && !this.state.isChangePassword) {
      if (localStorage.getItem("user") === this.state.userName) {
        this.setState({
          errorMessage:
            "Username's are not different. Please try some other username.",
        });
        return false;
      } else return true;
    }
    if (!this.state.isChangeUserName && this.state.isChangePassword) {
      if (this.state.oldPassword === this.state.newPassword) {
        this.setState({
          errorMessage: "Password not changed",
        });
        return false;
      } else {
        if (this.state.newPassword === this.state.confirmPassword) return true;
        else {
          this.setState({
            errorMessage: "Password Confirmation Failed",
          });
          return false;
        }
      }
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      responseSucess: false,
    });
    this.props.history.push("/Login");
  };

  render() {
    const { vertical, horizontal } = this.state;
    return (
      <React.Fragment>
        <Snackbar
          style={{ top: "100px" }}
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={this.state.responseSucess}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity="success">
            {this.state.isChangeUserName
              ? "Check your email to verify new username"
              : "Updated sucessfully. Please login with new credentials"}
          </Alert>
        </Snackbar>
        <div
          style={{
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginLeft: "75px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              maxWidth: "100%",
              marginBottom: "85px",
            }}
          >
            {this.state.errorMessage && (
              <Error>{this.state.errorMessage}</Error>
            )}
            {this.state.isChangeUserName && !this.state.isChangePassword && (
              <Box style={{ margin: "60px auto", marginBottom: "30px" }}>
                <TextBox
                  label="Username"
                  name="username"
                  // onChange={this.handleUserName}
                  inputProps={{ maxLength: 30 }}
                  value={localStorage.getItem("user")}
                />
                <TextBox
                  label="New Username"
                  name="username"
                  onChange={this.handleUserName}
                  inputProps={{ maxLength: 30 }}
                  value={this.state.userName}
                />
              </Box>
            )}
            {this.state.isChangePassword && !this.state.isChangeUserName && (
              <Box
                style={{
                  margin: "60px auto",
                  marginBottom: "10px",
                  marginTop: "40px",
                }}
              >
                <TextBox
                  label="Username"
                  name="username"
                  onChange={this.handleUserName}
                  inputProps={{ maxLength: 30 }}
                  value={
                    this.state.userName
                      ? this.state.userName
                      : localStorage.getItem("user")
                  }
                />
                <br />
                <PasswordTextBox
                  label="Old Password"
                  name="oldPassword"
                  onChange={this.handleOldPassword}
                  inputProps={{ maxLength: 30 }}
                  value={this.state.oldPassword}
                />
                <br />
                <PasswordTextBox
                  label="New Password"
                  name="newPassword"
                  onChange={this.handleNewPassword}
                  inputProps={{ maxLength: 30 }}
                  value={this.state.newPassword}
                />
                <br />
                <PasswordTextBox
                  label="Confirm"
                  name="username"
                  onChange={this.handleConfirmPassword}
                  inputProps={{ maxLength: 30 }}
                  value={this.state.confirmPassword}
                />
                <br />
              </Box>
            )}

            <Save onClick={this.updateUser} />
          </div>
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              position: "fixed",
              bottom: "15px",
            }}
          >
            {this.state.isChangeUserName && !this.state.isChangePassword && (
              <div>
                <div
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    boxShadow: "0 8px 6px -6px black",
                  }}
                  onClick={this.toggleChangeUserName}
                >
                  Change Username
                </div>
              </div>
            )}
            {!this.state.isChangeUserName && this.state.isChangePassword && (
              <div>
                <div
                  style={{ padding: "20px", cursor: "pointer" }}
                  onClick={this.toggleChangeUserName}
                >
                  Change Username
                </div>
              </div>
            )}
            {this.state.isChangeUserName && !this.state.isChangePassword && (
              <div>
                <div
                  style={{ padding: "20px", cursor: "pointer" }}
                  onClick={this.toggleChangePassword}
                >
                  Change Password
                </div>
              </div>
            )}
            {!this.state.isChangeUserName && this.state.isChangePassword && (
              <div>
                <div
                  style={{
                    padding: "20px",
                    cursor: "pointer",
                    boxShadow: "0 8px 6px -6px black",
                  }}
                  onClick={this.toggleChangePassword}
                >
                  Change Password
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ChangePassword;
