import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { MenuItem } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import AddMeeting from "../../Meeting/Create";
import AddObjective from "../../Objective/Create";
import AddNote from "../../Note/Create";
import { MenuButton } from "../../../components/controls/Button";
import { history } from "../../../store";
import ModalView from "../../../components/controls/Modal";
import {
  getOrganizations,
  OrganizationHOC,
} from "../../../context/OrganizationProvider";

class AddIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingIsOpen: false,
      objectiveIsOpen: false,
      noteIsOpen: false,
    };
  }

  componentDidMount = async () => {
    await getOrganizations();
  };

  handleNewMeeting = () => {
    this.setState({ meetingIsOpen: true });
  };

  handleCloseMeeting = () => {
    this.setState({ meetingIsOpen: false });
  };

  handleNewObjective = () => {
    this.setState({ objectiveIsOpen: true });
  };

  handleCloseObjective = () => {
    this.setState({ objectiveIsOpen: false });
  };

  handleNewNote = () => {
    this.setState({ noteIsOpen: true });
  };

  handleCloseNote = () => {
    this.setState({ noteIsOpen: false });
  };

  render() {
    return (
      <Fragment>
        <MenuButton
          id="menu-appbar"
          icon={<Add style={{ color: "rgb(255,165,0)" }} />}
        >
          <MenuItem key="Meeting" onClick={this.handleNewMeeting}>
            Meeting
          </MenuItem>
          <MenuItem key="Objective" onClick={this.handleNewObjective}>
            Objective
          </MenuItem>
          <MenuItem key="Note" onClick={this.handleNewNote}>
            Note
          </MenuItem>
        </MenuButton>

        <ModalView
          open={this.state.meetingIsOpen}
          onClose={this.handleCloseMeeting}
          title="Create Meeting"
        >
          <div style={{ overflowY: "auto", maxHeight: 600 }}>
            <AddMeeting onComplete={this.handleCloseMeeting} />
          </div>
        </ModalView>

        <ModalView
          open={this.state.objectiveIsOpen}
          onClose={this.handleCloseObjective}
          title="Create Objective"
        >
          <div style={{ overflowY: "auto", maxHeight: 600 }}>
            <AddObjective onComplete={this.handleCloseObjective} />
          </div>
        </ModalView>

        <ModalView
          open={this.state.noteIsOpen}
          onClose={this.handleCloseNote}
          title="Create Note"
        >
          <div>
            <AddNote onComplete={this.handleCloseNote} />
          </div>
        </ModalView>
      </Fragment>
    );
  }
}

export default OrganizationHOC(withRouter(AddIcon));
