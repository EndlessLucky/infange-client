import React, { Component } from "react";
import { connect } from "react-redux";
import Form from "../../components/controls/Form";
import TextField, { DateTimePicker } from "../../controls/TextField";
import { withStyles } from "@material-ui/core/styles";
import AddTags from "./AddTag";
import SelectInvitees from "./SelectInvitees";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DatePicker from "../../controls/Date";

const styles = {
  multiSelect: {
    flex: "0 0 100%",
  },
};

class MeetingFields extends Component {
  state = {
    open: false,
    locations: [],
    value: "",
    selectedDate: new Date(),
  };

  handleInvitees = (i) => {
    let t = {};
    t.value = i;
    t.name = "invitees";
    let e = { target: t };
    this.props.onChange(e);
  };

  handleStartDateChange = (date) => {
    let t = {};
    t.value = date;
    t.name = "startDate";
    let e = { target: t };
    this.props.onChange(e);
    t.value = new Date(date).setMinutes(new Date(date).getMinutes() + 30);
    t.name = "endDate";
    e = { target: t };
    this.props.onChange(e);
  };

  handleEndDateChange = (date) => {
    let t = {};
    t.value = date;
    t.name = "endDate";
    let e = { target: t };
    this.props.onChange(e);
  };
  handleTags = (a) => {
    this.setState(
      {
        tags: a,
      },
      () => this.props.handleTag(this.state.tags)
    );
  };

  handleDateChange = (date) => {
    let t = {};
    t.value = date;
    t.name = "date";
    let e = { target: t };
    this.props.onChange(e);
    this.setState({ selectedDate: date });
  };

  render() {
    const {
      onChange,
      title,
      location,
      purpose,
      invitees,
      organizationID,
      startDate,
      endDate,
      users,
      ownerID,
      classes,
      children,
    } = this.props;
    const { locations } = this.state;
    return (
      <Form>
        <div style={{ width: "100%", paddingLeft: 10 }}>
          <table>
            <tr>
              <tr>{/* <div style={{ paddingLeft: 10 }}>Title</div> */}</tr>
              <tr>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  variant="outlined"
                  onChange={onChange}
                  value={title}
                  style={{ width: "450px" }}
                />
              </tr>
            </tr>
            <tr>
              <tr>{/* <div style={{ paddingLeft: 10 }}>Purpose</div> */}</tr>
              <tr>
                <TextField
                  label="What do you hope to achieve"
                  name="purpose"
                  variant="outlined"
                  onChange={onChange}
                  value={purpose}
                  style={{ width: "450px" }}
                />
              </tr>
            </tr>
            <tr>
              <div>
                {/* <tr>Date</tr> */}
                {/* <tr>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      disableToolbar
                      variant="inline"
                      format="MM/dd/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      value={this.state.selectedDate}
                      onChange={this.handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </tr> */}
                <tr>
                  <div>
                    <DatePicker
                      value={this.state.selectedDate}
                      name="Date"
                      label="Date"
                      minDate={new Date()}
                      onChange={this.handleDateChange}
                      style={{ width: "450px" }}
                    />
                  </div>
                </tr>
              </div>
            </tr>
            <tr>
              <tr>{/* <div style={{ paddingLeft: 10 }}>Location</div> */}</tr>
              <tr>
                <TextField
                  label="Location"
                  name="location"
                  variant="outlined"
                  onChange={onChange}
                  inputProps={{ maxLength: 30 }}
                  value={location}
                  style={{ width: "450px" }}
                />
              </tr>
            </tr>
            <tr>
              <td>
                <td style={{ maxWidth: 200 }}>
                  <tr>Start Time</tr>
                  <tr style={{ width: "200px" }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        value={startDate || new Date()}
                        onChange={this.handleStartDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </tr>
                </td>
                <td style={{ maxWidth: 200, paddingLeft: 45 }}>
                  <tr>End Time</tr>
                  <tr>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        value={endDate || new Date()}
                        onChange={this.handleEndDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change time",
                        }}
                      />
                    </MuiPickersUtilsProvider>
                  </tr>
                </td>
              </td>
            </tr>
            <tr>
              <div style={{ marginTop: 15 }}>
                <tr>Attendees</tr>
                <tr>
                  <SelectInvitees
                    variant="outlined"
                    names={users.ddl}
                    handleInvitees={this.handleInvitees}
                    styles={{ width: "450px" }}
                  />
                </tr>
              </div>
            </tr>
            <tr>
              <div style={{ marginTop: 15 }}>
                <tr>
                  <div style={{ marginBottom: 5 }}>Tags</div>
                </tr>
                <tr>
                  <AddTags
                    width="450px"
                    handleTags={this.handleTags}
                    orgTags={
                      this.props.organizations[0] &&
                      this.props.organizations[0].tags &&
                      this.props.organizations[0].tags.map((tag) => {
                        return { title: tag };
                      })
                    }
                    tags={null}
                  />
                </tr>
              </div>
            </tr>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {children}
            </div>
          </table>
        </div>
      </Form>
    );
  }

  componentWillReceiveProps(p) {
    if (p.meetings !== this.props.meetings) {
      this.setState({ locations: Object.values(p.meetings), loading: false });
    }
  }

  componentDidMount() {
    this.setState({
      locations: Object.values(this.props.meetings).map((x) => {
        return {
          label: `${x.location}`,
          value: x._id,
        };
      }),
    });
  }
}

const mapStateToProps = (state) => {
  return { users: state.users, meetings: state.meetings.list };
};

export default connect(mapStateToProps)(
  OrganizationHOC(withStyles(styles)(MeetingFields))
);
