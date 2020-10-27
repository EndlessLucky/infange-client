import React, { useState, Fragment } from "react";
import Add from "@material-ui/icons/Add";
import { FabButton } from "../../../components/controls/Button";
import Objectives from "../../Objective/CardView";
import { useDispatch, useSelector } from "react-redux";
import users from "../../../reducers/users";
import Modal from "../../../components/controls/Modal";
import AddObjective from "../../Objective/Create";
import { deleteObjective } from "../../../actions/objective";
import DeleteObjective from "../../Objective/Delete";

function ViewObjectives(props) {
  const [objectiveIsOpen, setObjectiveIsOpen] = React.useState(false);
  const globalDispatch = useDispatch();
  const [pending, setPending] = React.useState(false);
  const {
    meetingID,
    objectives,
    organizationID,
    onDelete,
    id,
    insideMeeting,
    status,
  } = props;

  return (
    <Fragment>
      <div style={{ marginLeft: "65px" }}>
        <div>
          <h2> Objectives </h2>
        </div>
        <Objectives
          objectives={objectives}
          insideMeeting={insideMeeting}
          status={status}
        ></Objectives>
      </div>
    </Fragment>
  );
}

export default ViewObjectives;
