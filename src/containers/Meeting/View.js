import React, { PureComponent, Fragment } from "react";
import { connect } from "react-redux";
import moment from "moment";
import PropTypes from "prop-types";
import ViewAgenda from "./Topics";
import {
  getMeeting,
  editMeeting,
  updateInvitee,
  updateMeetingEndConfirm,
  updateMeetingNotes,
} from "../../actions/meeting";
import { receiveTopics } from "../../actions/topic";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Avatar from "../Avatar";
import { IconButton } from "../../components/controls/Button";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { UserAvatar } from "../Avatar";
import Button from "@material-ui/core/Button";
import { AccountHOC } from "../../context/AccountProvider";
import { getSocketInstance } from "../../socket";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Dialog from "../../components/Dialog";
import AddMeeting from "./Create";
import MModal from "../../components/controls/Modal";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MAvatar from "@material-ui/core/Avatar";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import getIconForStatus from "../../helpers/getIconForStatus";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { editObjective } from "../../actions/objective";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MeetingTimer from "./Timer";
import Chip from "@material-ui/core/Chip";
import Tags from "../../components/tag";

const Cancelled = getIconForStatus("Cancel");
const Completed = getIconForStatus("Done");
const Missed = getIconForStatus("Missed");
const Pending = getIconForStatus("Pending");
const InProgress = getIconForStatus("InProgress");

const styles = (theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "50%",
  },
  icon: {
    backgroundColor: "dimgrey",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "10px",
    color: "aliceblue",
    width: "3em",
    height: "3em",
  },
  statusIcon: {
    fontSize: 40,
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    marginTop: "20px",
  },
  status: {
    flex: "0 0 120px",
  },
  options: {
    flex: "0 0 100px",
  },
  text: {
    marginTop: "20px",
    flexGrow: 1,
  },
  topics: {
    marginTop: "20px",
  },
  tabWrapper: {
    textAlign: "center",
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  tabs: {
    display: "inline-block",
  },
  thumbUpIcon: {
    display: "flex",
  },
  thumbUp: {
    padding: 10,
    marginLeft: 5,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  progressBar: {
    width: "100%",
    cursor: "pointer",
    margin: "10px 35px 0px",
  },
  objDescriptions: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  objDate: {
    fontSize: 9,
  },
  fs10: {
    fontSize: 10,
  },
  chip: {
    fontSize: 9,
    backgroundColor: "#FFFFFF",
    height: 18,
    margin: 3,
  },
  viewObj: {
    overflowY: "auto",
    maxHeight: 600,
    paddingRight: 40,
    paddingLeft: 40,
    fontSize: 12,
    marginBottom: 40,
  },
});

const MeetingView = ({ startDate, endDate, location }) => (
  <Typography component="span" variant="body1" style={{ marginTop: "20px" }}>
    {startDate} {"-"} {endDate} {","} {location}
  </Typography>
);

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{
        padding: 8 * 3,
        height: "calc(100vh - 172px)",
        overflow: "scroll",
      }}
    >
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class Mtng extends React.Component {
  state = {
    value: 0,
    open: false,
    meetingIsOpen: false,
    meetingEndConfirmationModal: false,
    receiveEndConfirmation: true,
    confirmationMessage: "",
    meetingNotesModal: false,
    confirmReSchedule: false,
    createNewMeeting: false,
    meetingOptionsOpen: false,
    isVotingOpen: false,
    votingPerc: 0,
    anchorRef: null,
    isObjFilterOpen: false,
    objFilter: 30,
  };

  componentWillMount = () => {
    this.setState({ anchorRef: React.createRef() });
  };

  timeout = null;

  componentDidMount = () => {
    const { meetings, users, id } = this.props;
    const socketInstance = getSocketInstance();
    socketInstance.emit("join_room", id);
    socketInstance.on("meeting_end_confirmation", (payload) => {
      const userID = this.props.account[0]._id;
      if (userID != payload.updatorUserId) {
        if (this.state.isVotingOpen) this.setState({ isVotingOpen: false });
        this.setState({
          meetingEndConfirmationModal: true,
          confirmationMessage: payload.message,
        });
        this.timeoout = setTimeout(() => {
          this.setState({ meetingEndConfirmationModal: false });
        }, 30000);
      } else {
        this.props.getMeetings(payload.id);
        this.toggleVotingModal();
      }
    });
    socketInstance.on("meeting_end_cancelled", (payload) => {
      this.setState({ meetingEndConfirmationModal: false });
      clearTimeout(this.timeoout);
    });

    socketInstance.on("meeting_end_agreed", (payload) => {
      if (this.state.isVotingOpen) this.props.getMeetings(payload.id);
    });
  };
  componentWillUnmount = () => {
    const { id } = this.props;
    getSocketInstance().emit("leave_room", id);
  };

  handleTabs = (event, value) => {
    this.setState({ value });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  updateAgendas = (meeting, agendas) => {
    const newMeeting = { ...meeting, agendas };
    this.props.update(newMeeting);
  };

  setMeetingEndConfirmationModal = (s) => {
    this.setState({
      meetingEndConfirmationModal: s,
    });
  };

  setMeetingNotesModal = (s) => {
    this.setState({
      meetingNotesModal: s,
    });

    const { meetings, users, id } = this.props;

    const mtng = meetings[id];
    const owner = users.byID[mtng.ownerID];
    const userID = this.props.account[0]._id;

    const isOwner = owner._id === userID;
    if (!s && isOwner) {
      this.setState({
        confirmReSchedule: true,
      });
    }
  };

  onCloseReschedule = () => {
    this.setState({
      confirmReSchedule: false,
    });
  };

  handleCreateNewMeeting = () => {
    this.setCreateNewMeeting();
  };

  setCreateNewMeeting = () => {
    this.setState({
      confirmReSchedule: false,
      createNewMeeting: true,
    });
  };

  completeNewMeeting = () => {
    this.setState({
      createNewMeeting: false,
    });
  };

  toggleTab = () => {
    if (this.state.value === 0) {
      this.setState({
        value: 1,
      });
    } else {
      this.setState({
        value: 0,
      });
    }
  };

  toggleMeetingOptions = () => {
    this.setState((state) => {
      return {
        meetingOptionsOpen: !state.meetingOptionsOpen,
      };
    });
  };

  toggleVotingModal = () => {
    this.setState({ isVotingOpen: !this.state.isVotingOpen });
  };

  handleToggle = () => {
    this.setState({ isObjFilterOpen: !this.state.isObjFilterOpen });
  };

  handleFilterClick = (event) => {
    this.setState({ objFilter: event.target.id });
    this.setState({ isObjFilterOpen: false });
  };

  handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({ isObjFilterOpen: false });
    }
  };

  onObjClick = (e, obj) => {
    this.setState({ selectedObj: obj });
  };

  handleCloseObjective = (e) => {
    this.setState({ selectedObj: null });
  };

  handleCheckBox = async (e, obj) => {
    e.stopPropagation();
    const isChecked = !e.target.checked;
    let newObjective = {
      ...obj,
      status: isChecked ? "InProgress" : "Completed",
    };
    await this.props.editObjective(newObjective);
  };
  onStatusChange = (mtng, status) => {
    let newMtng = { ...mtng, status, statusUpdate: true };
    if (status == "InProgress") newMtng = { ...newMtng, startDate: new Date() };
    else if (status == "Ended") newMtng = { ...newMtng, endDate: new Date() };
    this.props.update(newMtng);
  };

  enterMeeting = (mtng) => {
    mtng.invitees.forEach((inv, index) => {
      if (inv.userID == this.props.account[0]._id)
        mtng.invitees[index].requestStatus = "Accept";
    });
    this.props.update(mtng);
  };

  render() {
    const {
      meetings,
      users,
      id,
      classes,
      objectives,
      update,
      confirmMeetingEnd,
      agreeMeetingNotes,
      organization,
      handleTagUpdates,
      meetingTags,
    } = this.props;

    const { value, editMode, confirmReSchedule, createNewMeeting } = this.state;
    if (!users.allIDs.length) return null;
    const mtng = meetings[id];

    if (!mtng) return null;
    let sortedObjectives =
      objectives[mtng._id] &&
      objectives[mtng._id].sort((a, b) => {
        if (a.status == "Completed" && b.status != a.status) return 1;
        else if (
          new Date(a.dueDate).getTime() < new Date().getTime &&
          new Date(a.dueDate).getTime() < new Date(b.dueDate)
        )
          return -1;
        else return 0;
      });
    if (
      this.state.objFilter &&
      this.state.objFilter != "All" &&
      sortedObjectives
    )
      sortedObjectives = sortedObjectives.filter(
        (o) =>
          new Date(o.dueDate) >
          new Date().setDate(new Date().getDate() - this.state.objFilter)
      );
    const owner = users.byID[mtng.ownerID];
    const userID = this.props.account[0]._id;

    const isOwner = owner._id === userID;

    const userInvite = mtng.invitees.find(
      (invitee) => invitee.userID === userID
    );
    const isAccepted = userInvite && userInvite.requestStatus === "Accept";
    const isDeclined = userInvite && userInvite.requestStatus === "Decline";

    const isMember = isOwner || userInvite;
    let votingCount = 0;
    mtng.invitees.map((invitee, i) => {
      if (invitee.isMeetingEndAgreed) votingCount++;
      if (
        i + 1 === mtng.invitees.length &&
        this.state.votingPerc !=
          ((votingCount + 1) / mtng.invitees.length) * 100
      )
        this.setState({
          votingPerc: ((votingCount + 1) / mtng.invitees.length) * 100,
        });
    });

    mtng.invitees.forEach((i) => {
      let data = Object.values(users.byID).find((usr) => usr._id == i.userID);
      i.color = data.color;
    });

    return (
      <Fragment>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.isVotingOpen}
          onClose={this.toggleVotingModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.isVotingOpen}>
            <div className={classes.paper}>
              <div className={classes.demo}>
                {mtng.invitees.map((invitee, i) => {
                  if (invitee.userID != mtng.meetingEndRequester)
                    return (
                      <List>
                        <ListItem>
                          <ListItemAvatar>
                            <MAvatar>
                              <UserAvatar
                                organizationID={mtng.organizationID}
                                userID={invitee.userID}
                              />
                            </MAvatar>
                          </ListItemAvatar>
                          <ListItemText primary={`${invitee.userName}`} />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                              {invitee.isMeetingEndAgreed ? (
                                <ThumbUpIcon />
                              ) : invitee.isMeetingEndAgreed === false ? (
                                <ThumbDownIcon />
                              ) : (
                                <ScheduleIcon />
                              )}
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    );
                })}
              </div>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={this.state.meetingEndConfirmationModal}
          onClose={() => this.setMeetingEndConfirmationModal(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.meetingEndConfirmationModal}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Meeting ended</h2>
              <p id="transition-modal-description">
                {this.state.confirmationMessage}
              </p>
              <Button
                onClick={() => {
                  confirmMeetingEnd(id, userID, true);
                  this.setMeetingEndConfirmationModal(false);
                }}
              >
                Yes
              </Button>
              <Button
                onClick={() => {
                  confirmMeetingEnd(id, userID, false);
                  this.setMeetingEndConfirmationModal(false);
                }}
              >
                No
              </Button>
            </div>
          </Fade>
        </Modal>

        <Dialog
          title={"Reschedule Meeting"}
          message={"Do you want to reshedule the meeting?"}
          open={confirmReSchedule}
          onClose={this.onCloseReschedule}
          actionContent={
            <>
              <Button
                variant="text"
                color="primary"
                onClick={this.handleCreateNewMeeting}
              >
                Reschedule
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={this.onCloseReschedule}
              >
                No
              </Button>
            </>
          }
        />

        <MModal
          open={createNewMeeting}
          onClose={this.completeNewMeeting}
          title="Add Meeting"
        >
          <AddMeeting
            onComplete={this.completeNewMeeting}
            location={mtng.location}
            title={mtng.title}
            status="Pending"
            startDate={""}
            endDate={""}
            invitees={mtng.invitees.map((x) =>
              users.ddl.find((y) => y.value === x.userID)
            )}
            organizationID={mtng.organizationID}
            isRescheduling={true}
            oldMeetingId={mtng._id}
          />
        </MModal>

        {this.state.selectedObj && (
          <MModal
            open={this.state.selectedObj}
            onClose={this.handleCloseObjective}
            title="Objective"
            style={{
              height: "400px",
              width: "450px",
              position: "fixed",
              left: "50%",
              top: "42%",
              marginTop: "-150px",
              marginLeft: "-150px",
            }}
          >
            <div className={classes.viewObj}>
              <table>
                <tr>
                  <tr>
                    <h3>Description</h3>
                  </tr>
                  <tr>
                    <div style={{ paddingLeft: 10 }}>
                      {" "}
                      {this.state.selectedObj.description}
                    </div>
                  </tr>
                </tr>
                <tr>
                  <tr>
                    <h3>Agenda</h3>
                  </tr>
                  <tr>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: Object.values(this.state.selectedObj.agenda)[0],
                      }}
                      style={{ flex: 10, marginTop: "-1em", paddingLeft: 10 }}
                    />
                  </tr>
                </tr>
              </table>
              <table style={{ color: "#00000078" }}>
                <tr>
                  <td>
                    <div>Organization</div>
                  </td>
                  <td>{this.props.organization.name}</td>
                </tr>
                <tr>
                  <td>
                    <div style={{ paddingRight: 10 }}>Assigned to</div>
                  </td>
                  <td>
                    {this.props.users.byID[this.state.selectedObj.assigneeID]
                      .firstName +
                      " " +
                      this.props.users.byID[this.state.selectedObj.assigneeID]
                        .lastName}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Assigned By</div>
                  </td>
                  <td>
                    {this.props.users.byID[this.state.selectedObj.assignedBy] &&
                      this.props.users.byID[this.state.selectedObj.assignedBy]
                        .firstName +
                        " " +
                        this.props.users.byID[this.state.selectedObj.assignedBy]
                          .lastName}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Due Date</div>
                  </td>
                  <td>
                    {moment
                      .utc(this.state.selectedObj.dueDate)
                      .format("DD/MM/YY")}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>status</div>
                  </td>
                  <td>{this.state.selectedObj.status}</td>
                </tr>
              </table>
            </div>
          </MModal>
        )}

        {isMember && (
          <div style={{ display: "flex", height: "100%", width: "100%" }}>
            {!this.props.minimize && (
              <div style={{ width: "13vw", backgroundColor: "#E8E7EF" }}>
                <div
                  style={{
                    padding: "0px 5px",
                    fontSize: "0.7em",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      height: 50,
                    }}
                  >
                    {mtng.status == "Ended" ? (
                      isOwner || isAccepted ? (
                        <Completed style={{ fill: "#74B57C", width: 25 }} />
                      ) : (
                        <Missed style={{ fill: "#FFE034", width: 25 }} />
                      )
                    ) : mtng.status == "Cancelled" ? (
                      <Cancelled
                        style={{ width: 25, fill: "#FFE034", fontWeight: 100 }}
                      />
                    ) : mtng.status == "Pending" ? (
                      <Pending
                        style={{ width: 25, fill: "#FFE034", fontWeight: 100 }}
                      />
                    ) : mtng.status == "InProgress" ? (
                      <InProgress
                        style={{ width: 25, fill: "#74B57C", fontWeight: 100 }}
                      />
                    ) : null}
                  </div>
                  <div
                    style={{
                      margin: "0px 10px",
                      height: "calc(100% - 50px)",
                      display: "flex",
                      alignItems: "space-between",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <h3>{mtng.title}</h3>
                      <div style={{ marginBottom: 5, fontSize: 12 }}>
                        {moment
                          .utc(mtng.startDate)
                          .local()
                          .format("dddd, MMM DD YYYY")}
                      </div>
                      <div style={{ marginBottom: 5, fontSize: 12 }}>
                        {moment.utc(mtng.startDate).local().format("LT")} -{" "}
                        {moment.utc(mtng.endTime).local().format("LT")}
                      </div>
                      <div style={{ fontSize: 12 }}>{mtng.location}</div>
                      <div style={{ marginRight: 10 }}>
                        <UserAvatar
                          organizationID={mtng.organizationID}
                          userID={owner && owner._id}
                          teamAvatar={true}
                          meetingInvitees={mtng.invitees || []}
                          meetingID={mtng._id}
                          usr={users}
                          mobileView={window.innerWidth <= 600 ? true : false}
                          size={25}
                        />
                      </div>
                      <div style={{ paddingTop: 30, paddingBottom: 30 }}>
                        <h3>Purpose:</h3>
                        <div style={{ fontSize: 13 }}>{mtng.purpose}</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        {mtng.status === "Completed" && (
                          <Button
                            size="small"
                            style={{
                              fontSize: 9,
                              backgroundColor: "#8B8B8B",
                              color: "white",
                            }}
                            disableElevation
                            variant="contained"
                          >
                            Meeting Ended
                          </Button>
                        )}
                        {mtng.status != "Completed" &&
                          !isOwner &&
                          userInvite &&
                          !isAccepted && (
                            <Button
                              size="small"
                              style={{
                                fontSize: 9,
                                backgroundColor: "#807AA5",
                                color: "white",
                              }}
                              variant="contained"
                              onClick={() => this.enterMeeting(mtng)}
                            >
                              Enter Meeting
                            </Button>
                          )}
                        {mtng.status != "Completed" && (isAccepted || isOwner) && (
                          <Button
                            size="medium"
                            style={{
                              fontSize: 9,
                              backgroundColor: "#8B8B8B",
                              color: "white",
                            }}
                            disableElevation
                            variant="contained"
                          >
                            Your are entered
                          </Button>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ zIndex: 1, marginTop: 7, marginRight: 10 }}>
                        <Tags
                          id={mtng._id}
                          tags={meetingTags}
                          orgTags={
                            organization &&
                            organization.tags.map((orgTag) => {
                              return { title: orgTag };
                            })
                          }
                          handleTagUpdates={handleTagUpdates}
                          getTags={() => {}}
                          icon={"TagFilled"}
                        />
                      </div>
                      {meetingTags &&
                        meetingTags.map((tag) => {
                          return <Chip label={tag} className={classes.chip} />;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                width: 0,
                position: "relative",
                left: -10,
              }}
            >
              <div onClick={this.props.onMinimize}>
                <IconButton
                  disableElevation
                  style={{
                    backgroundColor: "white",
                    color: "#CECECE",
                    borderColor: "#CECECE",
                    borderWidth: 1,
                    borderStyle: "solid",
                    width: 20,
                    height: 20,
                    padding: 0,
                  }}
                >
                  {this.props.minimize ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton>
              </div>
            </div>
            <div
              style={{
                width: this.props.minimize ? "82vw" : "55vw",
                height: "100%",
              }}
            >
              <div
                style={{
                  height: "40px",
                  backgroundColor: "#F5F5F5",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingLeft: "65px",
                  paddingRight: "45px",
                }}
              >
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "10px", fontSize: 12 }}>
                    In this Meeting:
                  </div>
                  <UserAvatar
                    organizationID={mtng.organizationID}
                    userID={owner && owner._id}
                    teamAvatar={true}
                    meetingInvitees={mtng.invitees || []}
                    meetingID={mtng._id}
                    usr={users}
                    mobileView={window.innerWidth <= 600 ? true : false}
                    size={25}
                    disableAddIcon
                    opacity={".55"}
                  />
                  {/* </div> */}
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      fontSize: 17,
                      paddingRight: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <MeetingTimer
                      initial={
                        mtng.status == "InProgress"
                          ? new Date().getTime() -
                            new Date(mtng.startDate).getTime()
                          : mtng.status == "Ended"
                          ? new Date(mtng.endDate).getTime() -
                            new Date(mtng.startDate).getTime()
                          : 0
                      }
                      startImmediately={
                        mtng.status == "InProgress" ? true : false
                      }
                    />
                  </div>
                  <div>
                    <Button
                      size="small"
                      style={{ fontSize: 9 }}
                      variant="contained"
                      color="primary"
                      disabled={
                        (!isAccepted && !isOwner) || mtng.status == "Ended"
                      }
                      onClick={
                        (!isAccepted && !isOwner) || mtng.status == "Ended"
                          ? null
                          : () =>
                              this.onStatusChange(
                                mtng,
                                mtng.status == "InProgress"
                                  ? "Ended"
                                  : "InProgress"
                              )
                      }
                    >
                      {mtng.status == "Ended"
                        ? "MEETING HAS ENDED"
                        : mtng.status == "InProgress" && (isAccepted || isOwner)
                        ? "END MEETING"
                        : "START MEETING"}
                    </Button>
                  </div>
                </div>
              </div>
              <div
                style={{ marginLeft: "65px" }}
                className={classes.flex}
              ></div>

              {isMember && (
                <TabContainer>
                  <ViewAgenda
                    mtng={mtng}
                    isMember={isMember}
                    objectives={objectives[mtng._id]}
                    status={mtng.status}
                    meetingID={mtng._id}
                    onUpdate={(agendas) => {
                      this.updateAgendas(mtng, agendas);
                    }}
                  />{" "}
                </TabContainer>
              )}
            </div>
            <div
              style={{
                width: this.props.minimize ? "17.9vw" : "15vw",
                backgroundColor: "#FFFFFF",
              }}
            >
              <div
                className={classes.modal}
                style={{ heigth: 60, maxHeight: 39 }}
              >
                <h5>Objectives</h5>
              </div>
              <Divider />

              <Button
                ref={this.state.anchorRef}
                aria-controls={
                  this.state.isObjFilterOpen ? "menu-list-grow" : undefined
                }
                style={{ width: "100%" }}
                onClick={this.handleToggle}
              >
                <div className={classes.modal} style={{ fontSize: 10 }}>
                  {this.state.objFilter == "All"
                    ? "All"
                    : `Last ${this.state.objFilter} Days`}{" "}
                </div>
                <ExpandMoreIcon />
              </Button>
              <Divider />

              <List component="nav" style={{ paddingTop: 0 }}>
                {objectives &&
                  objectives[mtng._id] &&
                  sortedObjectives.map((obj) => {
                    return (
                      <ListItem
                        id={obj._id}
                        button
                        divider
                        onClick={(e) => this.onObjClick(e, obj)}
                        style={{
                          paddingLeft: obj.status == "Completed" ? 16 : 4,
                          backgroundColor:
                            obj.status == "Completed"
                              ? "#DAEBDC"
                              : new Date(obj.dueDate).getTime() <
                                new Date().getTime()
                              ? "#FFE9E9"
                              : "#FDFDFD",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          {obj.status != "Completed" && (
                            <div>
                              <Checkbox
                                icon={
                                  <CheckBoxOutlineBlankIcon
                                    fontSize="small"
                                    style={{ width: 15 }}
                                  />
                                }
                                checkedIcon={
                                  <CheckBoxIcon
                                    fontSize="small"
                                    style={{ width: 15 }}
                                  />
                                }
                                onClick={(e) => this.handleCheckBox(e, obj)}
                              />
                            </div>
                          )}
                          <div>
                            <div className={classes.objDescriptions}>
                              {obj.description}
                            </div>
                            <div
                              className={
                                (classes.objDescriptions, classes.objDate)
                              }
                            >
                              {obj.status != "Completed"
                                ? "Due " +
                                  moment.utc(obj.dueDate).format("MM/DD/YYYY")
                                : "Completed"}
                            </div>
                          </div>
                        </div>
                      </ListItem>
                    );
                  })}
              </List>
              <Popper
                open={this.state.isObjFilterOpen}
                anchorEl={this.state.anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={this.handleClose}>
                        <MenuList
                          style={{ width: 200 }}
                          autoFocusItem={this.state.isObjFilterOpen}
                          id="menu-list-grow"
                          onKeyDown={this.handleListKeyDown}
                        >
                          {this.state.objFilter != 30 && (
                            <MenuItem
                              id={30}
                              className={[classes.modal, classes.fs10]}
                              onClick={this.handleFilterClick}
                            >
                              30 Days
                            </MenuItem>
                          )}
                          {this.state.objFilter != 60 && (
                            <MenuItem
                              id={60}
                              className={[classes.modal, classes.fs10]}
                              onClick={this.handleFilterClick}
                            >
                              60 Days
                            </MenuItem>
                          )}
                          {this.state.objFilter != 90 && (
                            <MenuItem
                              id={90}
                              className={[classes.modal, classes.fs10]}
                              onClick={this.handleFilterClick}
                            >
                              90 Days
                            </MenuItem>
                          )}
                          {this.state.objFilter != "All" && (
                            <MenuItem
                              id={"All"}
                              className={[classes.modal, classes.fs10]}
                              onClick={this.handleFilterClick}
                            >
                              All
                            </MenuItem>
                          )}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </div>
        )}
        {!isMember && (
          <Typography
            variant="h5"
            component="h5"
            style={{ textAlign: "center" }}
          >
            You are not authorized to view this
          </Typography>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    meetings: state.meetings.byID,
    objectives: state.objectives.byMeeting,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getMeetings: (id) => dispatch(getMeeting()),
  update: (mtng) => dispatch(editMeeting(mtng)),
  receiveTopics: (meetingId, topic) =>
    dispatch(receiveTopics(meetingId, topic)),
  updateInvitee: (meetingId, topic, requestStatus) =>
    dispatch(updateInvitee(meetingId, topic, requestStatus)),
  confirmMeetingEnd: (meetingId, topic, isAgreed) =>
    dispatch(updateMeetingEndConfirm(meetingId, topic, isAgreed)),
  agreeMeetingNotes: (meetingId, topic, isAgreed) =>
    dispatch(updateMeetingNotes(meetingId, topic, isAgreed)),
  editObjective: (obj) => dispatch(editObjective(obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(AccountHOC(Mtng)));
