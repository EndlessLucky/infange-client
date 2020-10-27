import React, { useState } from "react";
import { connect } from "react-redux";
import { editMeeting } from "../../actions/meeting";
import MenuItem from "@material-ui/core/MenuItem";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Select from "../../components/controls/DropDown";
import Dialog from "../../components/Dialog";
import { SaveButton } from "../../components/controls/Button";
import { AccountHOC } from "../../context/AccountProvider";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const ChangeStatus = ({ open, defaultStatus, onChange, pending, onClose }) => {
  const [status, setStatus] = useState(defaultStatus);
  const [isConfrmModalOpen, setConfrmModalOpen] = useState(false);

  const toggleConfirmationModal = () => {
    setConfrmModalOpen(!isConfrmModalOpen);
  };
  const handleSave = (status) => {
    if (status != "Ended") onChange(status);
    else toggleConfirmationModal();
  };
  return (
    <React.Fragment>
      <Dialog open={open && !isConfrmModalOpen} onClose={onClose}>
        <ClickAwayListener onClickAway={() => onClose()}>
          <div>
            <DialogTitle>Change Status</DialogTitle>
            <DialogContent onClose={onClose}>
              <Select
                label="Status"
                name="status"
                value={status}
                onChange={(e, v) => {
                  setStatus(v);
                }}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="InProgress">InProgress</MenuItem>
                <MenuItem value="Ended">Ended</MenuItem>
                <MenuItem value="Missed">Missed</MenuItem>
              </Select>
            </DialogContent>

            <DialogActions>
              <SaveButton
                color="primary"
                onClick={() => handleSave(status)}
                isLoading={pending}
                onClose={() => onClose(status)}
                disabled={defaultStatus === status}
              />
            </DialogActions>
          </div>
        </ClickAwayListener>
      </Dialog>
      <Dialog
        open={isConfrmModalOpen}
        onClose={() => setConfrmModalOpen(false)}
      >
        <ClickAwayListener onClickAway={() => setConfrmModalOpen(false)}>
          <div>
            <DialogTitle>Confirm</DialogTitle>
            <DialogContent onClose={() => setConfrmModalOpen(false)}>
              Are you sure you want to End Meeting
            </DialogContent>

            <DialogActions>
              <Button
                color="primary"
                onClick={() => setConfrmModalOpen(false)}
                isLoading={pending}
              >
                Back
              </Button>
              <Button
                color="primary"
                onClick={() => onChange(status)}
                isLoading={pending}
              >
                Sure
              </Button>
            </DialogActions>
          </div>
        </ClickAwayListener>
      </Dialog>
    </React.Fragment>
  );
};

const ChangingStatus = ({
  meeting: {
    _id,
    ownerID,
    organizationID,
    oldMeetings,
    assigneeID,
    meeting,
    createDate,
    invitees,
    startDate,
    endDate,
    title,
    type,
    location,
    status,
  },
  users,
  update,
  onClose,
  account,
}) => {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = React.useState(true);
  async function editStatus(status) {
    try {
      setPending(true);

      await update({
        _id,
        ownerID,
        organizationID,
        oldMeetings,
        assigneeID,
        createDate,
        invitees,
        startDate,
        endDate,
        meeting,
        title,
        type,
        location,
        status,
      });
      onClose(status);
    } catch (err) {
      console.warn(err);
    }
    setPending(false);
  }

  return (
    <div>
      <ChangeStatus
        open={open}
        onClose={(s) => {
          onClose(s);
          setOpen(false);
        }}
        defaultStatus={status}
        pending={pending}
        onChange={editStatus}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { meetings: state.meetings.byID, users: state.users };
};

const mapDispatchToProps = (dispatch) => ({
  update: (mtng) => dispatch(editMeeting(mtng)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountHOC(ChangingStatus));
