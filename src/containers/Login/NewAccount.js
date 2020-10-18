// import React, { Component } from "react";
// import Button from "../../components/controls/Button";
// import TextBox from "../../controls/TextField";
// import Form from "../../components/Form";
// import { TextField } from "../../../node_modules/@material-ui/core";
// import { newAccount, login } from "../../helpers/api";
// import Typography from "@material-ui/core/Typography";
// import Box from "../../components/controls/Box";
// import { connect } from "react-redux";
// import { Error } from "../../components/controls/Message";
// import MuiAlert from "@material-ui/lab/Alert";
// import Snackbar from "@material-ui/core/Snackbar";

// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

// class NewAccount extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       firstName: "",
//       lastName: "",
//       email:
//         props.location && props.location.state
//           ? props.location.state.email
//           : "",
//       password: null,
//       confirmpassword: null,
//       isLoading: false,
//       error: null,
//       resendSuccess: false,
//     };
//   }

//   handleChange = (e) => {
//     this.setState({ [e.target.name]: e.target.value });
//   };

//   handleClose = () => {
//     this.props.history.push("/login");
//   };

//   handleCreateUser = async () => {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmpassword,
//     } = this.state;

//     if (firstName && lastName && email) {
//       this.setState({ isLoading: true });

//       try {
//         await newAccount({
//           firstName,
//           lastName,
//           username: email,
//           password,
//           confirmpassword,
//         });
//         this.setState({ resendSuccess: true });
//       } catch (err) {
//         this.setState({ error: err.data.message });
//       } finally {
//         this.setState({ isLoading: false });
//       }
//     }
//   };

//   render() {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       confirmpassword,
//       isLoading,
//       error,
//     } = this.state;
//     return (
//       <Form>
//         {this.state.resendSuccess && (
//           <Snackbar
//             open={true}
//             autoHideDuration={2000}
//             onClose={this.handleClose}
//           >
//             <Alert onClose={this.handleClose} severity="success">
//               A verification link has been sent to your email account
//             </Alert>
//           </Snackbar>
//         )}
//         <Box style={{ margin: "80px auto" }}>
//           <Typography
//             variant="h6"
//             style={{ marginLeft: "10px", paddingBottom: "20px" }}
//           >
//             Create Account
//           </Typography>

//           {error ? <Error>{error}</Error> : null}

//           <TextBox
//             label="First Name"
//             name="firstName"
//             autoFocus
//             value={firstName}
//             onChange={this.handleChange}
//             required
//           />
//           <TextBox
//             label="Last Name"
//             name="lastName"
//             value={lastName}
//             onChange={this.handleChange}
//             required
//           />
//           <TextBox
//             label="Email"
//             name="email"
//             value={email}
//             onChange={this.handleChange}
//             helperText={null}
//             required
//           />
//           <TextBox
//             label="Password"
//             name="password"
//             value={password}
//             onChange={this.handleChange}
//             required
//           />
//           <TextBox
//             label="Confirm Password"
//             name="confirmpassword"
//             value={confirmpassword}
//             onChange={this.handleChange}
//             required
//           />
//           <Button
//             type="submit"
//             color="primary"
//             isLoading={isLoading}
//             onClick={this.handleCreateUser}
//           >
//             Create Account
//           </Button>
//         </Box>
//       </Form>
//     );
//   }
// }

// export default connect()(NewAccount);

import React, { Component } from "react";
import Button from "../../components/controls/Button";
import TextBox from "../../controls/TextField";
import Form from "../../components/Form";
import { TextField } from "../../../node_modules/@material-ui/core";
import { newAccount, login } from "../../helpers/api";
import Typography from "@material-ui/core/Typography";
import Box from "../../components/controls/Box";
import { connect } from "react-redux";
import { Error } from "../../components/controls/Message";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class NewAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email:
        props.location && props.location.state
          ? props.location.state.email
          : "",
      password: null,
      confirmpassword: null,
      isLoading: false,
      error: null,
      resendSuccess: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClose = () => {
    this.props.history.push("/login");
  };

  handleCreateUser = async () => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpassword,
    } = this.state;

    if (firstName && lastName && email) {
      this.setState({ isLoading: true });

      try {
        await newAccount({
          firstName,
          lastName,
          username: email,
          password,
          confirmpassword,
        });
        this.setState({ resendSuccess: true });
      } catch (err) {
        this.setState({ error: err.data.message });
      } finally {
        this.setState({ isLoading: false });
      }
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmpassword,
      isLoading,
      error,
    } = this.state;
    return (
      <Form>
        {this.state.resendSuccess && (
          <Snackbar
            open={true}
            autoHideDuration={2000}
            onClose={this.handleClose}
          >
            <Alert onClose={this.handleClose} severity="success">
              A verification link has been sent to your email account
            </Alert>
          </Snackbar>
        )}
        <Box style={{ margin: "80px auto" }}>
          <Typography
            variant="h6"
            style={{ marginLeft: "10px", paddingBottom: "20px" }}
          >
            Create Account
          </Typography>

          {error ? <Error>{error}</Error> : null}
          <div>
            <TextBox
              label="First Name"
              name="firstName"
              autoFocus
              value={firstName}
              onChange={this.handleChange}
              required
              style={{ width: 450 }}
            />
          </div>
          <div>
            <TextBox
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
              required
              style={{ width: 450 }}
            />
          </div>
          <div>
            <TextBox
              label="Email"
              name="email"
              value={email}
              onChange={this.handleChange}
              helperText={null}
              required
              style={{ width: 450 }}
            />
          </div>
          <div>
            <TextBox
              label="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
              required
              style={{ width: 450 }}
            />
          </div>
          <div>
            <TextBox
              label="Confirm Password"
              name="confirmpassword"
              value={confirmpassword}
              onChange={this.handleChange}
              required
              style={{ width: 450 }}
            />
          </div>
          <Button
            type="submit"
            color="primary"
            isLoading={isLoading}
            onClick={this.handleCreateUser}
          >
            Create Account
          </Button>
        </Box>
      </Form>
    );
  }
}

export default connect()(NewAccount);
