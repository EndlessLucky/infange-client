import React, { Component } from "react";
import { connect } from "react-redux";
import Objectives from "./Fields";
import { createObjective } from "../../actions/objective";
import { SaveButton } from "../../components/controls/Button";
import { history } from "../../store";

class CreateObjective extends Component {
  constructor(props) {
    super(props);
    const {
      assigneeID = "",
      status = "",
      description = "",
      dueDate = "",
      organizationID = "",
    } = props;
    this.state = {
      organizationID,
      assigneeID,
      dueDate,
      status,
      loading: false,
      description,
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleChangeAssigneedBy = (assignedBy) => {
    this.setState({
      assignedBy: assignedBy,
    });
  };

  returnMain = (obj) => {
    this.props.onComplete();
  };

  handleSave = async () => {
    try {
      this.setState({ loading: true });
      let agenda = {};
      agenda[`${this.props.agendaID}`] = this.props.agenDA;
      let obj = await this.props.create({
        ...this.state,
        tags: this.state.tags,
        organizationID: this.state.organizationID || this.props.organizationID,
        meetingID: this.props.meetingID || null,
        agenda: agenda,
        status: "Pending",
      });

      if (obj._id && (this.props.isAgendaCardOpen || this.props.linkOpen)) {
        this.props.getObjective(obj._id, obj.description);
      } else {
        this.returnMain(obj);
      }
    } catch (err) {
      this.setState({ loading: false });
    }
  };

  handleDateChange = (date) => {
    this.setState({ dueDate: date });
  };
  handleTags = (a) => {
    this.setState({
      tags: a,
    });
  };

  render() {
    const {
      organizationID,
      assigneeID,
      dueDate,
      loading,
      description,
      status,
    } = this.state;
    return (
      <div>
        <Objectives
          onChange={this.handleChange}
          organizationID={organizationID}
          assigneeID={assigneeID}
          dueDate={dueDate}
          description={description}
          status={status}
          hideorg={this.props.hideorg}
          handleTag={this.handleTags}
          handleChangeAssigneedBy={this.handleChangeAssigneedBy}
        >
          <SaveButton
            color="primary"
            onClick={this.handleSave}
            isLoading={loading}
          />
        </Objectives>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    organizationID: state.organizationID,
    users: state.users,
    objectives: state.objectives.list,
  };
};

const mapDispatchToProps = (dispatch) => ({
  create: (objective) => dispatch(createObjective(objective)),
  updateOrgID: (orgID) =>
    dispatch({ type: "RECEIVE_ORGANIZATIONID", payload: orgID }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateObjective);
