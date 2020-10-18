import React, { Component } from "react";
import { MenuItem } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Box from "../../components/controls/Box";
import Select from "../../components/controls/DropDown";
import { SaveButton } from "../../components/controls/Button";
import { IconButton } from "../../components/controls/Button";
import Address from "../../components/controls/Address";
import TextBox from "../../controls/TextField";
import EmailTextBox from '../../controls/EmailField';
import PhoneTextBox from '../../controls/PhoneField';
import { Add } from "@material-ui/icons";
import Email from "@material-ui/icons/Email";
import Phone from "@material-ui/icons/Phone";
import Form from "../../components/Form";
import { history } from "../../store";
import LockOpenIcon from "@material-ui/icons/LockOpen";

const styles = theme => ({
  contactNames: {
    paddingRight: "50px"
  },
  nickName: {
    textAlign: "center",
    paddingBottom: "30px",
    paddingRight: "30px"
  },
  contactInfo: {
    paddingLeft: "5px"
  },
  icon: {
    marginLeft: "200px"
  }
});

class UserFields extends Component {
  state = {
    newContacts: []
  };

  handleChange = e => {
    this.setState({
      firstName: e.target.value,
      lastName: e.target.value,
      nickName: e.target.value,
      address: e.target.value
    });
  };

  handleAddressChange = e => {
    let n = e.target.name;
    let v = e.target.value;
    this.setState(s => {
      let a = { ...s.address };
      a[n] = v;
      return { ...s, address: a };
    });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleProfileChange = profile => {
    this.setState({
      firstName: profile.firstName,
      lastName: profile.lastName,
      nickName: profile.nickName,
      address: profile.address,
      organizationID: profile.organizationID,
      contact: profile.contact
        ? profile.contact.map(x => {
            return { ...x };
          })
        : []
    });
  };

  handleContactChange = i => e => {
    const v = e.target.value;
    this.setState(s => {
      let c = [...s.contact];
      c[i].info = v;
      return { ...s, contact: c };
    });
  };

  handleNewContactChange = (i, n) => e => {
    const v = e.target.value;
    this.setState(s => {
      let c = [...s.newContacts];
      c[i][n] = v;
      return { ...s, newContacts: c };
    });
  };

  handleComplete = e => {
    e.preventDefault();
    this.setState({ pending: true });
    const user = { ...this.state };
    delete user.loading;
    delete user.pending;
    delete user.newContacts;
    user.contact = [
      ...user.contact,
      ...this.state.newContacts.filter(x => x.type && x.info)
    ];

    delete user.email;
    this.props.onComplete(user);
    this.setState({ pending: false, newContacts: [] });
    this.goToDashboard();
    return false;
  };

  goToDashboard = () => {
    history.push("/");
    window.location.reload();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleAddContact = () => {
    this.setState(s => {
      return { ...s, newContacts: [...s.newContacts, { type: "", info: "" }] };
    });
  };

  handleSave = async () => {
    try {
      this.setState({ pending: true });
      const user = { ...this.state };
      delete user.loading;
      delete user.pending;
      delete user.newContacts;
      user.contact = [
        ...user.contact,
        ...this.state.newContacts.filter(x => x.type)
      ];

      delete user.email;
      await this.props.update(user);
      this.returnMain();
    } catch (err) {
      console.log(err);
      this.setState({ pending: false });
    }
  };

  render() {
    const { classes } = this.props;
    const {
      firstName,
      lastName,
      nickName,
      address,
      contact,
      loading
    } = this.state;
    if (!this.props.profile) {
      return null;
    }

    const contacts = contact.map((x, i) => {
      if (x.type === "email") {
        return (
          <EmailTextBox
            onChange={this.handleContactChange(i)}
            key={x.type + i}
            value={x.info}
          />
        );
      } else if (x.type === "phone") {
        return (
          <PhoneTextBox
            onChange={this.handleContactChange(i)}
            key={x.type + i}
            value={x.info}
          />
        );
      }
      return null;
    });

    return (
      <React.Fragment>
        <Form onSubmit={this.handleComplete}>
          <Box>
            <Typography variant="headline" className={classes.contactNames}>
              {" "}
              {firstName} {lastName}{" "}
            </Typography>
            <Typography variant="subheading" className={classes.nickName}>
              {" "}
              {nickName}{" "}
            </Typography>

            <Typography variant="subheading" className={classes.contactInfo}>
              {" "}
              Contact Information{" "}
            </Typography>
            <TextBox
              label="FirstName"
              name="firstName"
              onChange={this.handleChange}
              value={firstName}
            />
            <TextBox
              label="LastName"
              name="lastName"
              onChange={this.handleChange}
              value={lastName}
            />

            <Typography
              variant="subheading"
              style={{ paddingTop: "20px", paddingLeft: "5px" }}
            >
              {" "}
              Address{" "}
            </Typography>
            <Address address={address} onChange={this.handleAddressChange} />
            {contacts}
          </Box>

          {this.state.newContacts.map((x, i) => (
            <div key={`${i}newContact`}>
              <Select
                value={x.type}
                onChange={this.handleNewContactChange(i, "type")}
                autoWidth
              >
                <MenuItem value={"email"}>
                  {" "}
                  <Email style={{ color: "#808080" }} />
                </MenuItem>
                <MenuItem value={"phone"}>
                  {" "}
                  <Phone style={{ color: "#808080" }} />
                </MenuItem>
              </Select>
              {x.type === "email" ? (
                <EmailTextBox
                  icon={false}
                  onChange={this.handleNewContactChange(i, "info")}
                  value={x.info}
                />
              ) : x.type === "phone" ? (
                <PhoneTextBox
                  icon={false}
                  onChange={this.handleNewContactChange(i, "info")}
                  key={x.type + i}
                  value={x.info}
                />
              ) : (
                <TextBox
                  style={{ width: "78%" }}
                  value={x.info}
                  onChange={this.handleNewContactChange(i, "info")}
                />
              )}
            </div>
          ))}
          <IconButton className={classes.icon} onClick={this.handleAddContact}>
            {" "}
            <Add />{" "}
          </IconButton>

          <div style={{ width: "400px" }}>
            <button
              style={{
                paddingTop: "12px",
                paddingBottom: "12px",
                paddingLeft: "15px",
                paddingRight: "15px",
                marginBottom: "15px",
                backgroundColor: "#ff9900",
                color: "#fff",
                fontSize: "15px"
              }}
              type="button"
              // variant="text"
              onClick={() => window.location.replace("Change")}
            >
              Change username and password
            </button>
          </div>

          <SaveButton color="primary" type="submit" isLoading={loading} />
        </Form>
        {/* <button onClick={()=>window.location.replace("Change")} >Change username and password</button> */}
      </React.Fragment>
    );
  }

  componentWillReceiveProps(p) {
    if (p.profile) this.handleProfileChange(p.profile);
  }
}

export default withStyles(styles)(UserFields);
