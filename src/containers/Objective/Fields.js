import React, { PureComponent } from "react";
import { connect } from "react-redux";
import OrganizationSelect from "../OrganizationSelect";
import { MenuItem } from "@material-ui/core";
import Form from "../../components/controls/Form";
import Select from "../../components/controls/DropDown";
import TextBox from "../../controls/TextField";
import DatePicker from "../../controls/Date";
import AddTags from "../Meeting/AddTag";
import { OrganizationHOC } from "../../context/OrganizationProvider";

class ObjectiveFields extends PureComponent {
  state = {
    loading: true,
    assignedBy: null,
  };

  handleDateChange = (date) => {
    let e = {};
    let t = {};
    t.name = "dueDate";
    t.value = date;
    e.target = t;
    this.props.onChange(e, this.state.assignedBy);
  };
  handleTags = (a) => {
    this.props.handleTag(a);
  };

  onChangeAssigned = (e) => {
    this.setState(
      {
        assignedById: e.target.value._id,
        assignedBy: e.target.value,
      },
      () => this.props.handleChangeAssigneedBy(this.state.assignedById)
    );
  };

  render() {
    const { loading, userList } = this.state;
    return loading ? null : this.renderForm();
  }
  renderForm() {
    const {
      onChange,
      organizationID,
      assigneeID,
      dueDate,
      status,
      meetingID,
      description,
      children,
    } = this.props;
    const { loading, userList } = this.state;
    if (userList)
      userList.map((x) => {
        if (
          x.clientID == localStorage.clientID &&
          this.state.assignedBy == null
        ) {
          this.setState(
            {
              assignedBy: x,
            },
            () => this.props.handleChangeAssigneedBy(x._id)
          );
        }
      });

    return (
      <Form>
        <div style={{ width: "100%", paddingLeft: 10 }}>
          <table>
            <tr>
              <tr>{/* <div style={{ paddingLeft: 10 }}>Objective</div> */}</tr>
              <tr>
                <TextBox
                  label="What would you like to get done?"
                  name="description"
                  multiline
                  onChange={onChange}
                  inputProps={{ rows: 5 }}
                  value={description}
                  variant="outlined"
                  style={{ width: 450 }}
                />
              </tr>
            </tr>
            <tr>
              <tr>
                <div style={{ paddingLeft: 10 }}>Organization</div>
              </tr>
              <tr>
                <div style={{ marginLeft: -10 }}>
                  <OrganizationSelect
                    onChange={onChange}
                    value={organizationID}
                    name="organizationID"
                    style={{ width: 450 }}
                    variant="outlined"
                  />
                </div>
              </tr>
            </tr>
            <tr>
              <tr>
                <div style={{ paddingLeft: 10 }}>Assignee</div>
              </tr>
              <tr>
                <Select
                  onClose={this.handleClose}
                  onOpen={this.handleOpen}
                  value={assigneeID}
                  onChange={onChange}
                  name="assigneeID"
                  id="controlled-open-select"
                  style={{ width: 450, marginLeft: -10 }}
                  variant="outlined"
                >
                  {userList.map((x) => (
                    <MenuItem
                      key={x._id}
                      value={x._id}
                    >{`${x.firstName} ${x.lastName}`}</MenuItem>
                  ))}
                </Select>
              </tr>
            </tr>
            <tr>
              <tr>
                <div style={{ paddingLeft: 10 }}>Assigned by</div>
              </tr>
              <tr>
                {/* <div style={{ marginLeft: -10 }}> */}
                {this.state.assignedBy && (
                  <TextBox
                    // label="Assigned By"
                    name="assignedBy"
                    value={`${this.state.assignedBy.firstName} ${this.state.assignedBy.lastName}`}
                    variant="outlined"
                    style={{ width: 450 }}
                  />
                )}
                {/* </div> */}
              </tr>
            </tr>
            <tr>
              <tr>
                <div style={{ paddingLeft: 10 }}>Due Date</div>
              </tr>
              <tr>
                <div>
                  <DatePicker
                    value={dueDate}
                    name="dueDate"
                    minDate={new Date()}
                    label={null}
                    onChange={this.handleDateChange}
                    style={{ width: "450px", marginTop: "-10px" }}
                  />
                </div>
              </tr>
            </tr>
            <tr>
              <tr>
                <div style={{ paddingLeft: 10 }}>AddTags</div>
              </tr>
              <tr>
                <AddTags
                  width="450px"
                  label="Add Tags (Optional)"
                  handleTags={this.handleTags}
                  style={{ width: 300 }}
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
    if (p.users !== this.props.users) {
      this.setState({ userList: Object.values(p.users.byID), loading: false });
    }
  }

  componentDidMount() {
    this.setState({
      userList: Object.values(this.props.users.byID),
      loading: false,
    });
  }
}

const mapStateToProps = (state) => {
  return { users: state.users };
};

export default connect(mapStateToProps)(OrganizationHOC(ObjectiveFields));
