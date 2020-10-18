import React, { Component } from "react";
import { connect } from "react-redux";
import MeetingFields from "./Fields";
import { createMeeting, rescheduleMeeting } from "../../actions/meeting";
import { SaveButton } from "../../components/controls/Button";
import { history } from "../../store";

class CreateMeeting extends Component {
  constructor(props) {
    super(props);
    const {
      location = "",
      title = "",
      status = "Pending",
      startDate = new Date(),
      endDate = new Date().setMinutes(new Date().getMinutes() + 30),
      duration = "",
      invitees = "",
      organizationID = "",
      isRescheduling = false,
      oldMeetingId = "",
      purpose = "",
    } = props;
    this.state = {
      location,
      title,
      status,
      startDate,
      endDate,
      duration,
      loading: false,
      invitees,
      organizationID,
      isRescheduling,
      oldMeetingId,
      date: new Date(),
      purpose,
    };
  }

  handleChange = (e) => {
    if (e.target.name === "startDate" || e.target.name === "endDate") {
      e.target.value = new Date(
        new Date(e.target.value).setDate(new Date(this.state.date).getDate())
      );
    }
    if (e.target.name === "date")
      this.setState({
        startDate: new Date(
          new Date(this.state.startDate).setDate(
            new Date(e.target.value).getDate()
          )
        ),
        endDate: new Date(
          new Date(this.state.endDate).setDate(
            new Date(e.target.value).getDate()
          )
        ),
      });
    this.setState({ [e.target.name]: e.target.value });
  };

  handleTags = (a) => {
    this.setState({
      tags: a,
    });
  };

  newMeetingFromState() {
    const s = this.state;
    return {
      createDate: new Date(),
      startDate: s.startDate,
      endDate: s.endDate,
      invitees: s.invitees
        ? s.invitees.map((x) => {
            return {
              userID: x.value,
              userName: x.label,
            };
          })
        : [],
      status: s.status,
      location: s.location,
      title: s.title,
      organizationID: "5b2a63078f565c741c141482", //set to default
      tags: s.tags,
      purpose: s.purpose,
    };
  }

  returnMain = () => {
    this.props.onComplete();
  };

  handleSave = async () => {
    try {
      this.setState({ loading: true });
      if (this.state.isRescheduling) {
        await this.props.reschedule(
          this.state.oldMeetingId,
          this.newMeetingFromState()
        );
      } else {
        await this.props.create(this.newMeetingFromState());
      }
      this.props.updateOrgID(this.state.organizationID);
      this.returnMain();
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <MeetingFields
          onChange={this.handleChange}
          {...this.state}
          handleTag={this.handleTags}
        >
          <SaveButton
            color="primary"
            onClick={this.handleSave}
            isLoading={loading}
          />
        </MeetingFields>
      </div>
    );
  }

  componentDidMount() {
    this.setState({
      userList: Object.values(this.props.users.byID).map((x) => {
        return {
          label: `${x.firstName} ${x.lastName}`,
          value: x._id,
        };
      }),
    });
  }

  componentWillReceiveProps(p) {
    if (p.users && p.users.byID !== this.props.users.byID) {
      this.setState({
        userList: Object.values(p.users.byID).map((x) => {
          return {
            label: `${x.firstName} ${x.lastName}`,
            value: x._id,
          };
        }),
      });
    }
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
    meetings: state.meetings.list,
    organizationID: state.organizationID,
  };
};

const mapDispatchToProps = (dispatch) => ({
  create: (mtng) => dispatch(createMeeting(mtng)),
  reschedule: (oldId, mtng) => dispatch(rescheduleMeeting(oldId, mtng)),
  updateOrgID: (orgID) =>
    dispatch({ type: "RECEIVE_ORGANIZATIONID", payload: orgID }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeeting);
