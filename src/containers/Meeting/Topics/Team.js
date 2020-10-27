import React, { Fragment } from "react";
import Add from "@material-ui/icons/Add";
import { FabButton } from "../../../components/controls/Button";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import MultiSelect from "multiselect";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { UserAvatar } from "../../Avatar";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Cancel from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import red from "@material-ui/core/colors/red";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TrashIcon from "@material-ui/icons/Delete";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { createInvitee, deleteInvitee } from "../../../actions/meeting";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  multiSelect: {
    flex: "0 0 100%",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    marginLeft: theme.spacing(3),
  },

  button: {
    margin: theme.spacing(1),
  },
}));
const redTheme = createMuiTheme({ palette: { primary: red } });

const Users = ({ attendees, organizationID, onDelete, onSave }) => {
  const classes = useStyles();
  return attendees.map((attendee) => (
    <ListItem className="attendee" key={attendee.userID}>
      <UserAvatar organizationID={organizationID} userID={attendee.userID} />
      <ListItemText
        className={classes.listItem}
        primary={attendee.name}
        secondary={attendee.requestStatus}
      />
      <IconButton onClick={() => onDelete(attendee.userID)}>
        <TrashIcon />
      </IconButton>
      {attendee.isAgreed != undefined ? (
        attendee.isAgreed ? (
          <div>
            <ThumbUpIcon />
          </div>
        ) : (
          <div>
            <ThumbDownIcon />
          </div>
        )
      ) : (
        ""
      )}
    </ListItem>
  ));
};

function ViewTeam(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [pending, setPending] = React.useState(false);
  const [selectedUsers, setSelectedUsers] = React.useState([]);
  const globalDispatch = useDispatch();
  const {
    meetingID,
    invitees,
    users,
    open,
    toggleModal,
    updateInvitees,
  } = props;
  const newInvitees = [];
  var attendees = [];

  attendees = invitees.map(
    (y) => `${users.byID[y.userID].firstName} ${users.byID[y.userID].lastName}`
  );
  const handleOpen = () => {
    newInvitees.length = 0;
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
    setSelectedUsers([]);
  };

  const handleInvitees = (selectedValue) => {
    setSelectedUsers(selectedValue);
  };

  const saveInvitees = (selectedValue) => {
    selectedUsers.map((userOption) => {
      let newEntry = {
        isAgreed: false,
        requestStatus: "Pending",
        userID: userOption.value,
        userName: userOption.label,
      };
      newInvitees.push(newEntry);
      invitees.push(newEntry);
    });

    updateInvitees(invitees);
    addInvitees();
    handleClose();
  };

  const addInvitees = async () => {
    try {
      setPending(true);
      await globalDispatch(createInvitee(meetingID, newInvitees));
    } catch (err) {
      console.warn(err);
    }
    setPending(false);
  };

  const removeInvitee = async (removedUserID) => {
    try {
      setPending(true);
      await globalDispatch(deleteInvitee(meetingID, removedUserID));
    } catch (err) {
      console.warn(err);
    }
    // setPending(false);
  };

  return (
    <Fragment>
      <div>
        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
          >
            <div style={modalStyle} className={classes.paper}>
              <h2 id="simple-modal-title">Add More Invitees</h2>

              <div className={classes.multiSelect}>
                <MultiSelect
                  label="Users"
                  id="usersSelection"
                  value={selectedUsers}
                  options={users.ddl.filter(
                    (x) => !invitees.find((y) => y.userID === x.value)
                  )}
                  onChange={handleInvitees}
                />
              </div>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={saveInvitees}
                display="inline"
                className={classes.button}
                startIcon={<SaveIcon />}
              >
                Save
              </Button>
              <MuiThemeProvider theme={redTheme}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleClose}
                  display="inline"
                  className={classes.button}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </MuiThemeProvider>
            </div>
          </Modal>
        </div>
      </div>
    </Fragment>
  );
}

export default ViewTeam;
