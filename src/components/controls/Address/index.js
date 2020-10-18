import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import Box from "../Box";
import TextBox from "../../../controls/TextField";

const styles = (theme) => ({
  addressInfo: {
    paddingLeft: "5px",
  },
});

class Address extends PureComponent {
  handleProfileChange = (profile) => {
    this.setState({
      street: profile.address.street,
      city: profile.address.city,
      state: profile.address.state,
      zipcode: profile.address.zipcode,
      organizationID: profile.organizationID,
    });
  };

  render() {
    const { address, onChange } = this.props;
    const { street = "", city = "", state = "", zipcode = "" } = address;

    return (
      <Box>
        <TextBox
          style={{ maxWidth: "100% " }}
          label="Street"
          name="street"
          onChange={onChange}
          value={street}
        />
        <TextBox
          style={{ width: "300px" }}
          label="City"
          name="city"
          onChange={onChange}
          value={city}
        />
        <TextBox
          style={{ width: "300px" }}
          label="State"
          name="state"
          onChange={onChange}
          value={state}
        />
        <TextBox
          style={{ width: "300px" }}
          label="Zipcode"
          name="zipcode"
          onChange={onChange}
          value={zipcode}
        />
      </Box>
    );
  }

  componentWillReceiveProps(p) {
    if (p.profile) this.handleProfileChange(p.profile);
  }
}

export default withStyles(styles)(Address);
