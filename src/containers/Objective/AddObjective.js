import React from "react";
import CreateObjective from "./Create";
import axios from "axios";
import { history } from "../../store";

class AddObjective extends React.Component {
  getObjective = (objID, desc) => {
    this.props.location.state.mtng.agendas.forEach((agnd) => {
      if (agnd._id === this.props.location.state.agenda._id) {
        let objective = {};
        objective[`${objID}`] = desc;
        // agenda.objectiveID.push(objective)
        this.props.location.state.agenda.objectiveID.splice(0, 0, objective);
        agnd.objectiveID = this.props.location.state.agenda.objectiveID;
      }
    });
    this.linkObjectiveAndMeeting();
  };

  linkObjectiveAndMeeting = async () => {
    const response = await axios.put(
      `/api/meetings/${this.props.location.state.meetingID}`,
      this.props.location.state.mtng
    );
    if (response.status === 200)
      history.push(`/Meetings/${this.props.location.state.mtng._id}`);
    // setObjectiveIsOpen(false)
  };
  render() {
    return (
      <React.Fragment>
        {this.props.location.state.fromNav && (
          <div style={{ marginLeft: 50 }}>
            <CreateObjective />
          </div>
        )}
        {this.props.location.state.linkOpen && (
          <div style={{ marginLeft: 50 }}>
            <CreateObjective
              hideorg={true}
              meetingID={this.props.location.state.meetingID}
              organizationID={this.props.location.state.organizationID}
              getObjective={this.getObjective}
              linkOpen={true}
              agenDA={this.props.location.state.agenDA}
              agendaID={this.props.location.state.agendaID}
            />
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AddObjective;
