import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import CreateMeeting from "./Create";
import ChangeStatus from "./ChangingStatus";
import Modal from "../../components/controls/Modal";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import Dialog from "@material-ui/core/Dialog";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import EditIcon from "@material-ui/icons/Edit";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { IconButton } from "../../components/controls/Button";
import { history } from "../../store";
import LinkedMeetings from "./LinkedMeetings";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

const MeetingOptions = ({
  onEdit,
  meeting,
  users,
  clickImg,
  openMenuOnClickImg,
  toggleMeetingOptions,
  classes,
  canEdit,
}) => {
  let anchorEl = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openNewMeeting, setOpenNewMeeting] = useState(false);
  const [openLinkedMeetings, setOpenLinkedMeetings] = useState(false);
  const [statusSaver, setStatusSaver] = useState(openMenuOnClickImg);

  return (
    <div
      tabindex="0"
      onBlur={() => {
        if (openMenu && !openStatus) setOpenMenu(false);
      }}
    >
      {!openMenuOnClickImg && (
        <div style={{ display: "flex" }}>
          {canEdit && (
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
          )}
        </div>
      )}

      {openMenuOnClickImg && (
        <Popper open={statusSaver} anchorEl={anchorEl.current} transition>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <MenuList>
                  <Dialog
                    open={statusSaver}
                    onClose={() => {
                      setStatusSaver(false);
                      toggleMeetingOptions();
                    }}
                  >
                    <ChangeStatus
                      meeting={meeting}
                      onClose={(status) => {
                        setStatusSaver(false);
                        toggleMeetingOptions(status);
                      }}
                    />
                  </Dialog>
                  {meeting.oldMeetings && meeting.oldMeetings.length !== 0 && (
                    <>
                      <Dialog
                        open={openLinkedMeetings}
                        onClose={() => setOpenLinkedMeetings(false)}
                      >
                        <LinkedMeetings
                          meetings={meeting.oldMeetings}
                          onClose={() => setOpenLinkedMeetings(false)}
                        />
                      </Dialog>
                      <MenuItem onClick={() => setOpenLinkedMeetings(true)}>
                        Linked Meetings
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}

      {
        <Popper
          open={openMenu || openStatus}
          anchorEl={anchorEl.current}
          transition
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <MenuList>
                  <MenuItem onClick={() => setOpenStatus(true)}>
                    Change Status
                  </MenuItem>
                  <Dialog
                    open={openStatus}
                    onClose={() => setOpenStatus(false)}
                  >
                    <ChangeStatus
                      meeting={meeting}
                      onClose={() => setOpenStatus(false)}
                    />
                  </Dialog>

                  <MenuItem onClick={onEdit}>Edit</MenuItem>

                  {meeting.oldMeetings && meeting.oldMeetings.length !== 0 && (
                    <>
                      <Dialog
                        open={openLinkedMeetings}
                        onClose={() => setOpenLinkedMeetings(false)}
                      >
                        <LinkedMeetings
                          meetings={meeting.oldMeetings}
                          onClose={() => setOpenLinkedMeetings(false)}
                        />
                      </Dialog>
                      <MenuItem onClick={() => setOpenLinkedMeetings(true)}>
                        Linked Meetings
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      }
    </div>
  );
};

const mapStateToProps = (state) => {
  return { meetings: state.meetings.byID, users: state.users };
};

export default connect(mapStateToProps)(MeetingOptions);
