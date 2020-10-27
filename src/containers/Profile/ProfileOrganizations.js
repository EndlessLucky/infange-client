import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import TextBox from "../../controls/TextField";
import Save from "../../components/controls/Button/Save";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
const axios = require("axios").default;

const styles = (theme) => ({
  button: {
    marginLeft: "50px",
    color: "primary",
  },
  list: {
    paddingLeft: "70px",
  },
  leftPortion: {
    textAlign: "left",
    paddingLeft: "50px",
  },
  selectedOrganization: {
    background: "#FF7F50",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class ProfileOrganizations extends PureComponent {
  state = {
    firstName: null,
    lastName: null,
    street: null,
    city: null,
    state: null,
    zipCode: null,
    clientID: null,
    organizationID: null,
    organizationName: null,
    updated: false,
  };

  componentDidMount = () => {
    this.setState({
      firstName: this.props.profiles[0].firstName,
      lastName: this.props.profiles[0].lastName,
      street: this.props.profiles[0].address.street,
      city: this.props.profiles[0].address.city,
      state: this.props.profiles[0].address.state,
      zipCode: this.props.profiles[0].address.zipCode,
      // clientID: this.props.profile
    });
    this.props.getProfile(this.props.profiles);
  };

  onFirstNameChange = (event) => {
    this.setState({
      firstName: event.target.value,
    });
  };

  onLastNameChange = (event) => {
    this.setState({
      lastName: event.target.value,
    });
  };

  onStreetChange = (event) => {
    this.setState({
      street: event.target.value,
    });
  };

  onCityChange = (event) => {
    this.setState({
      city: event.target.value,
    });
  };

  onStateChange = (event) => {
    this.setState({
      state: event.target.value,
    });
  };

  onZipCodeChange = (event) => {
    this.setState({
      zipCode: event.target.value,
    });
  };

  updateUser = async () => {
    const address = {
      street: this.state.street,
      city: this.state.city,
      state: this.state.state,
      zipCode: this.state.zipCode,
    };
    const data = {
      address: address,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      clientID: this.props.profiles[0].clientID,
      organizationID: this.props.profiles[0].organizationID,
      organizationName: this.props.profiles[0].organizationName,
    };
    try {
      const response = await axios.put(
        `/api/account/Users/${this.props.profiles[0]._id}`,
        data
      );
      if (response.status === 200) {
        this.setState({
          updated: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  handleClose = () => {
    this.setState({
      updated: false,
    });
  };

  render() {
    const { profiles, classes, organizationID, ...props } = this.props;
    const {
      firstName,
      lastName,
      street,
      city,
      state,
      zipCode,
      updated,
    } = this.state;

    return (
      <React.Fragment>
        <Snackbar
          open={updated}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          <Alert onClose={this.handleClose} severity="success">
            Profile has been updated
          </Alert>
        </Snackbar>
        <div style={{ width: "500px" }}>
          <div>
            <TextBox
              label="FirstName"
              name="firstName"
              inputProps={{ maxLength: 30 }}
              value={firstName}
              onChange={this.onFirstNameChange}
            />
            <TextBox
              label="LastName"
              name="lastName"
              inputProps={{ maxLength: 30 }}
              value={lastName}
              onChange={this.onLastNameChange}
            />
          </div>
          <div>
            <div style={{ margin: 5 }}>
              <TextBox
                label="Street"
                style={{ maxWidth: "100% " }}
                name="street"
                inputProps={{ maxLength: 30 }}
                value={street}
                onChange={this.onStreetChange}
                multiline
              />
            </div>
            <div style={{ margin: 5 }}>
              <TextBox
                label="City"
                name="city"
                style={{ maxWidth: "100% " }}
                inputProps={{ maxLength: 30 }}
                value={city}
                onChange={this.onCityChange}
              />
            </div>
            <div style={{ margin: 5 }}>
              <TextBox
                label="State"
                name="state"
                style={{ maxWidth: "100% " }}
                inputProps={{ maxLength: 30 }}
                value={state}
                onChange={this.onStateChange}
              />
            </div>
            <div style={{ margin: 5 }}>
              <TextBox
                label="ZipCode"
                style={{ maxWidth: "100% " }}
                name="zipCode"
                inputProps={{ maxLength: 30 }}
                value={zipCode}
                onChange={this.onZipCodeChange}
              />
            </div>
            <div onClick={this.updateUser} style={{ marginLeft: 20 }}>
              <Save />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  componentWillUpdate(p) {
    if (p.organizationID && !this.props.organizationID) {
      let profile = p.profiles.find(
        (x) => x.organizationID === p.organizationID
      );
      if (profile) {
        this.props.onChange(profile);
      }
    }
  }

  componentDidMount() {
    let profile = this.props.profiles.find(
      (x) => x.organizationID === this.props.organizationID
    );
    if (profile) {
      this.props.onChange(profile);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    organizationID:
      state.organizationID ||
      (state.profiles.length > 0 ? state.profiles[0].organizationID : ""),
    profiles: state.profiles,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateOrgID: (orgID) =>
    dispatch({ type: "RECEIVE_ORGANIZATIONID", payload: orgID }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ProfileOrganizations));
