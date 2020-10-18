import React, { Component } from "react";
import Button from "../../components/controls/Button";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Box from "../../components/controls/Box";
import Form from "../../components/Form";
import PasswordTextBox from "../../controls/Password";
import { Error } from "../../components/controls/Message";
import { resetpwd } from "../../helpers/api";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ResetPwd extends Component {
  state = {
    password: null,
    confirmpwd: null,
    error: null,
    onSucess: false,
    isLoading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleResetPwd = async () => {
    const { password, confirmpwd } = this.state;
    try {
      this.setState({ isLoading: true });
      await resetpwd(
        {
          password,
          confirmpwd
        },
        this.props.match.params.token
      );
      this.setState({ onSucess: true, isLoading: false });
    } catch (err) {
      this.setState({ error: err.data.message, isLoading: false });
    }
  };
  handleClose = () => {
    this.setState({ onSucess: false });
    window.location.pathname = "/Login";
  };

  render() {
    const { password, confirmpwd, isLoading, error } = this.state;
    return (
      <Form>
        <Box style={{ margin: "80px auto" }}>
          <Typography
            variant="h6"
            style={{ marginLeft: "10px", paddingBottom: "20px" }}
          >
            Reset Password
          </Typography>

          {error ? <Error>{error}</Error> : null}

          <PasswordTextBox
            onChange={this.handleChange}
            label="Password"
            name="password"
            id="password"
            error={Boolean(error)}
            value={password}
          />
          <PasswordTextBox
            onChange={this.handleChange}
            label="Cofirm Password"
            name="confirmpwd"
            id="confirmpwd"
            error={Boolean(error)}
            value={confirmpwd}
          />
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            onClick={this.handleResetPwd}
            isLoading={isLoading}
          >
            Reset
          </Button>
        </Box>
        {this.state.onSucess && (
          <Snackbar
            open={true}
            autoHideDuration={3000}
            onClose={this.handleClose}
          >
            <Alert onClose={this.handleClose} severity="success">
              Successfully chenged password
            </Alert>
          </Snackbar>
        )}
      </Form>
    );
  }
}

export default connect()(ResetPwd);
