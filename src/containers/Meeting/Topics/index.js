import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import CustomEditor from "ckeditor";
import CKEditor from "@ckeditor/ckeditor5-react";
import EditableAgenda from "../EditableAgenda";
// import AgendaTypeIcons from "../AgendaTypeIcons";
import Grow from "@material-ui/core/Grow";
import { MenuItem } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import ListIcon from "@material-ui/icons/List";
import Select from "../../../components/controls/DropDown";
import DateTimePicker from "../../../controls/Date"; // TODO: Make DateTime Picker
import { makeStyles } from "@material-ui/core/styles";
import { useAccount } from "../../../context/AccountProvider";
import { getMeeting, editMeeting } from "../../../actions/meeting";
import { createTopic, deleteTopic, getTopics } from "../../../actions/topic";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { arraymove } from "../../../helpers/utils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import PlusIcon from "@material-ui/icons/Add";
import MinusIcon from "@material-ui/icons/Remove";
import { UserAvatar } from "../../Avatar";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
    width: "100%",
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 13,
    width: "100%",
    padding: "8px 12px",
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 100,
  },
  paper: {
    padding: theme.spacing(3, 2),
  },
  menuItem: {
    marginLeft: "20px",
  },
  question: {
    color: "#FFC0CB",
  },
  objective: {
    color: "#32CD32",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  select: {
    display: "inline-block",
    alignItems: "flex-end",
  },
  clickToStart: {
    // color: "#bbb",
    display: "inline-block",
    // width: "calc(100% - 50px)",
    width: "100%",
    backgroundColor: "#EFEFEF",
  },
  itemAction: {
    display: "inline-block",
    width: "calc(100% - 50px)",
  },
  agendaTypeIcons: {
    marginBottom: "50px",
  },
  ckEditor: {
    marginBottom: "10px",
  },
  addAdenda: {
    cursor: "pointer",
    margin: "5px 0",
    marginLeft: "50px",
    "&:hover > div": {
      visibility: "visible",
    },
  },
  newAgendaItem: {
    [theme.breakpoints.down("md")]: {
      visibility: "visible",
    },
    visibility: "hidden",
  },
  newAgendaButton: {
    padding: 2,
    fontSize: 10,
  },
  z_button: {
    "background-color": "#FFA500",
    height: "20px",
    outline: 0,
    display: "block",
    color: "#fff",
    "border-radius": "100%",
    width: "20px",
  },
  z_plus: {
    "text-align": "center",
    "line-height": "20px",
    "font-size": "30px",
  },
}));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const ViewAgenda = ({
  meetingID,
  topics,
  getMeetings,
  getTopicsByMeeting,
  createAgenda,
  onUpdate,
  isMember,
  mtng,
  objectives,
  status,
}) => {
  let anchorEl = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [open, setOpen] = useState(false);
  const [newData, setNewData] = useState(false);
  const [newAgenda, setNewAgenda] = useState(null);
  const [agendaItems, setAgendaItems] = useState([]); // This gets populated from meeting... Then when we save we add to it
  const [editorData, setEditorData] = useState(null);
  const [addIcon, setAddIcon] = useState(false);
  const [subject, setSubject] = useState(null);
  const [account] = useAccount();
  const classes = useStyles();

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.source.index !== result.destination.index) {
      setAgendaItems((a) => {
        arraymove(a, result.source.index, result.destination.index);
        return [...a];
      });
      onUpdate(agendaItems);
    }
  }

  useEffect(() => {
    getTopicsByMeeting(meetingID);
  }, [meetingID]);

  useEffect(() => {
    if (topics[meetingID]) {
      setAgendaItems(topics[meetingID]);
      if (topics[meetingID].length > 0)
        setNewAgenda(topics[meetingID].length - 1);
      else setNewAgenda(null);
    }
  }, [topics]);

  if (topics[meetingID] == null) return null;
  // new Array(topics[meetingID].length).fill(null).map((x, i) => i)
  function handleStartDateChange(date) {
    let t = {};
    t.value = date;
    t.name = "startDate";
    let e = { target: t };
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChange(e) {
    setAssignee(e.target.value);
  }

  async function saveObjective(meetingID, assigneeID, dueDate, description) {}

  // Either this will call an action or you will pull your agendas out of global state
  async function saveData(data, meetingID) {
    let d = await axios.post(`/api/meetings/${meetingID}/agendas`, {
      type: selectedType,
      title: "Some title here",
      doc: data,
    });
    let item = d.data;
    setAgendaItems([...agendaItems, item]);
    getMeetings(meetingID);
  }

  function saveEditor(position) {
    if (newData && editorData) {
      setNewData(false);
      if (position != null) {
        createAgenda(
          meetingID,
          {
            type: selectedType,
            title: "Some title here",
            doc: `<h4>${subject ? subject : ""}</h4>${editorData}`,
          },
          true,
          setAgendaItems,
          position,
          agendaItems,
          setNewAgenda,
          onUpdate
        );
      } else {
        createAgenda(meetingID, {
          type: selectedType,
          title: "Some title here",
          doc: editorData,
        });
      }
      setSubject(null);
      setSelectedType("");
    }
  }
  const onMouse1 = () => {
    setAddIcon(true);
  };

  const onMouse2 = () => {
    setAddIcon(false);
  };
  const addAgenda = (position) => {
    return (
      <Paper>
        <Popper open={openMenu} anchorEl={anchorEl.current} transition>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper>
                <MenuList>
                  <MenuItem>
                    {" "}
                    <ListIcon color="primary" />
                    <span className={classes.menuItem}> Topic </span>{" "}
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>

        {selectedType === "Objective" && (
          <div className={classes.itemAction}>
            <div className={classes.select}>
              <Select
                open={open}
                label="Who"
                onClose={handleClose}
                onOpen={handleOpen}
                value={assignee}
                onChange={handleChange}
              >
                <MenuItem value="Brian Staver"> Brian Staver </MenuItem>
                <MenuItem value="Scott Hoopes"> Scott Hoopes </MenuItem>
              </Select>
            </div>
            <div className={classes.select}>
              <DateTimePicker
                name="startDate"
                label="When"
                onChange={handleStartDateChange}
              />
            </div>
          </div>
        )}

        <ClickAwayListener onClickAway={() => saveEditor(position)}>
          <div
            className={classes.clickToStart}
            onClick={() => setSelectedType("Topic")}
          >
            <div style={{ margin: 10 }}>
              <BootstrapInput
                placeholder="Subject (Optional)"
                onChange={(e) => setSubject(e.target.value)}
                width={"100%"}
              />
            </div>
            <CKEditor
              editor={CustomEditor}
              onInit={(editor) => {
                console.log("Editor is ready to use!", editor);
                editor.editing.view.focus();
              }}
              onChange={async (event, editor) => {
                setNewData(true);
                setEditorData(editor.getData());
              }}
              config={{
                ckfinder: {
                  uploadUrl: "/api/upload",
                },
              }}
              onFocus={(editor) => {
                console.log("Focus.", editor);
                setSelectedType("Topic");
              }}
            />
          </div>
        </ClickAwayListener>
      </Paper>
    );
  };

  return (
    <div style={{ marginLeft: "5px" }} className={classes.root}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              onMouseOver={onMouse1}
              onMouseOut={onMouse2}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {agendaItems.map((item, index) => (
                <Draggable
                  key={item._id}
                  draggableId={item._id}
                  index={index}
                  isDragDisabled={status === "Ended" ? true : false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div style={{ display: "flex", width: "92%" }}>
                        <div style={{ marginRight: 15 }}>
                          <UserAvatar
                            userID={item.ownerID}
                            size={30}
                            organizationID={account.organizationID}
                          />
                        </div>
                        <EditableAgenda
                          ended={status === "Ended"}
                          objectives={objectives}
                          isDragging={snapshot.isDragging}
                          mtng={mtng}
                          key={item._id}
                          indent={item.indent ? item.indent : 0}
                          agenda={item}
                          meetingID={meetingID}
                          canEdit={
                            account.data &&
                            account.data.find((y) => y._id === item.ownerID) &&
                            status != "Ended"
                          }
                          isMember={isMember}
                          onChange={(a) =>
                            setAgendaItems(
                              agendaItems.map((y) =>
                                y._id === item._id ? a : y
                              )
                            )
                          }
                          onCheck={(e) => {
                            let i = agendaItems.findIndex(
                              (a) => a._id === e.target.id
                            );
                            let agendas = agendaItems;
                            agendas[i] = {
                              ...agendas[i],
                              discussed: e.target.checked,
                            };
                            onUpdate(agendas);
                          }}
                          firstUnchecked={
                            agendaItems.find((a) => a.discussed == false) ==
                            item
                          }
                        />
                      </div>
                      {!snapshot.isDragging && (
                        <div
                          className={classes.addAdenda}
                          onClick={() =>
                            newAgenda === null || newAgenda != index
                              ? setNewAgenda(index)
                              : !(newAgenda === agendaItems.length - 1)
                              ? setNewAgenda(agendaItems.length - 1)
                              : setNewAgenda(null)
                          }
                          style={{ alignItems: "left" }}
                        >
                          <div className={classes.newAgendaItem}>
                            <IconButton
                              className={classes.newAgendaButton}
                              size={"small"}
                              color={"primary"}
                            >
                              <PlusIcon fontSize={"small"} />
                            </IconButton>
                          </div>
                          {/*  <div className={addIcon ? "mouseIn" : "mouseOut"}>*/}
                          {/*    {status != "Ended" && (*/}
                          {/*      <div className={classes.z_button} tabindex="0">*/}
                          {/*        <div className={classes.z_plus}>*/}
                          {/*          {index === newAgenda ? "-" : "+"}*/}
                          {/*        </div>*/}
                          {/*      </div>*/}
                          {/*    )}*/}
                          {/*    {status === "Ended" && <div>{"  "}</div>}*/}
                          {/*  </div>*/}
                        </div>
                      )}
                      <div
                        className={index === newAgenda ? classes.ckEditor : ""}
                      >
                        {!snapshot.isDragging &&
                          status != "Ended" &&
                          index === newAgenda &&
                          addAgenda(index)}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {newAgenda === null &&
                agendaItems.length === 0 &&
                status != "Ended" &&
                addAgenda()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { users: state.users, topics: state.topics.byMeeting };
};

const mapDispatchToProps = (dispatch) => ({
  getMeetings: () => dispatch(getMeeting()),
  getTopicsByMeeting: (meetingID) => dispatch(getTopics(meetingID)),
  deleteAgenda: (meetingID, topicID) =>
    dispatch(deleteTopic(meetingID, topicID)),
  createAgenda: async (
    meetingID,
    agenda,
    ordering = false,
    setAgendaItems,
    position,
    agendaItems,
    setNewAgenda,
    onUpdate
  ) => {
    if (ordering) {
      createTopic(meetingID, agenda, true).then((response) => {
        agendaItems.splice(position + 1, 0, response);
        setAgendaItems(agendaItems);
        onUpdate(agendaItems);
        setNewAgenda(null);
      });
    } else {
      dispatch(createTopic(meetingID, agenda));
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewAgenda);
