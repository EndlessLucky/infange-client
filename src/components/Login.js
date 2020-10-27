import React from "react";
import Button from "./controls/Button";
import TextBox from "../controls/TextField";
import PasswordTextBox from "../controls/Password";
import Box from "./controls/Box";
import { withStyles } from "@material-ui/core/styles";
import { Error } from "./controls/Message";
import Form from "./Form";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const styles = (theme) => ({
  paper: {
    margin: 0,
    position: "absolute",
    width: "350px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: theme.spacing(3),
  },
  flex: {
    width: "290px",
    margin: "auto",
  },
  // button: {
  //   margin: theme.spacing(1),
  //   marginTop: theme.spacing(3),
  //   width: "100%",
  //   maxWidth: 250
  // },
  signin: {
    maxWidth: "100px",
    fontSize: "20",
    marginTop: "10px",
    margin: "auto",
  },
});
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const NavigateTo = (props) => <RouterLink to="/NewAccount" {...props} />;

const Login = ({
  children,
  classes,
  onChange,
  onSubmit,
  error,
  username,
  password,
  isLoading,
  onResendRequest,
  resend,
  onSucess,
  handleClose,
  reset,
  onResetRequest,
  resendmsg,
}) => (
  <Form>
    <Typography
      variant="subheading"
      style={{ paddingRight: "20px", textAlign: "right" }}
    >
      {" "}
      {!resend && !reset && (
        <Link component={NavigateTo}> Create a FREE Account </Link>
      )}{" "}
    </Typography>

    <Box style={{ margin: "80px auto" }}>
      {Boolean(error) ? <Error>{error}</Error> : null}
      {onSucess && (
        <Snackbar open={true} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {resend
              ? "Verification link has been sent to your email account"
              : "Check your email for a link to reset"}
          </Alert>
        </Snackbar>
      )}
      <Typography variant="h6">
        {resend
          ? ""
          : reset
          ? "A link to Reset your password will be sent to your email."
          : "Sign In"}
      </Typography>
      <TextBox
        onChange={onChange}
        label="User Name"
        name="username"
        value={username}
        error={Boolean(error)}
        id="username"
        style={{ width: 450 }}
      />
      <div style={{ width: "100%" }}>
        {!resend && !reset && (
          <TextBox
            onChange={onChange}
            label="Password"
            name="password"
            id="password"
            error={Boolean(error)}
            value={password}
            style={{ width: 450 }}
          />
        )}
      </div>
      <div>
        {!resend && !reset && (
          <Typography
            variant="subheading"
            style={{
              margin: "10px",
              "text-align": "center",
              cursor: "pointer",
            }}
            onClick={() => onResetRequest()}
          >
            {" "}
            Forgot password?{" "}
          </Typography>
        )}
      </div>
      <Button
        className={classes.signin}
        color="primary"
        onClick={resend ? onResendRequest : reset ? onResetRequest : onSubmit}
        type="submit"
        isLoading={isLoading}
      >
        {resend ? "Resend" : reset ? "Send" : "Sign in"}
      </Button>
      <Typography
        variant="subheading"
        style={{ margin: "10px", "text-align": "center", cursor: "pointer" }}
        onClick={() =>
          resend
            ? onResendRequest(null, true)
            : reset
            ? onResetRequest(null, true)
            : onResendRequest()
        }
      >
        {resend || reset ? "Back" : resendmsg ? "Resend verification Link" : ""}
      </Typography>

      {children}
    </Box>
  </Form>
);

export default withStyles(styles)(Login);
