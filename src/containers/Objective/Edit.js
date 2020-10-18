import React, { useState, useReducer, useEffect } from "react";
import { deleteObjective, editObjective } from "../../actions/objective";
import { useSelector, useDispatch } from "react-redux";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import Select from "../../components/controls/DropDown";
import { MenuItem } from "@material-ui/core";
import TextBox from "../../controls/TextField";
import DatePicker from "../../controls/Date";
import { useAccount } from "../../context/AccountProvider";
import Button from "../../components/controls/Button";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import MuiTableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import NativeSelect from "@material-ui/core/NativeSelect";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import InputBase from "@material-ui/core/InputBase";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CustomEditor from "ckeditor";
import { createNote, editNote } from "../../actions/note";
import { connect } from "react-redux";
import Tags from "../../components/tag";
import moment from "moment";
import CKEditor from "@ckeditor/ckeditor5-react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { history } from "../../store";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const TableCell = withStyles({
  root: {
    borderBottom: "none",
    fontSize: "20px",
    fontFamily: "Medium 20px/33px Helvetica Neue",
  },
})(MuiTableCell);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
    },
  },
}))(InputBase);

const reducer = (state, action) => {
  const { value, type } = action;
  switch (type) {
    case "organizationID":
      return { ...state, organizationID: value };
    case "agenda":
      return { ...state, agenda: value };
    case "assigneeID":
      return { ...state, assigneeID: value };
    case "status":
      return { ...state, status: value };
    case "dueDate":
      return { ...state, dueDate: value };
    case "description":
      return { ...state, description: value };
    case "update_objective":
      return { ...value };
    default:
      return state;
  }
};

// TODO: Display message if objective delete or save fails
const EditObjective = ({
  objective: {
    organizationID,
    assigneeID,
    status,
    meetingID,
    meetings,
    dueDate,
    description,
    ownerID,
    _id,
    agenda,
    tags,
    reminder,
    days,
  },
  objective,
  notes,
  onClose,
  organizations,
  createNote,
  editNote,
  editObjective,
  handleTagUpdates,
}) => {
  const meetingURL = `/Meetings/${meetings[0]}`;
  const [saving, setSaving] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isAssignee, setIsAssignee] = useState(false);
  const [error, setError] = useState(null);
  const [daysState, setDaysState] = useState(days || 1);
  const [reminderState, setReminderState] = useState(reminder);
  const [isEdit, setEdit] = useState(false);
  const [objNote, setObjNote] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const { users } = useSelector((state) => ({
    users: Object.values(state.users.byID),
  }));
  const [account] = useAccount();
  const globalDispatch = useDispatch();
  const [state, dispatch] = useReducer(reducer, {
    organizationID,
    assigneeID,
    status,
    dueDate,
    meetingID,
    meetings,
    description,
    ownerID,
    agenda,
  });

  let note;
  useEffect(() => {
    note = notes.list.find((n) => n.objectiveID == _id);
    if (note) setObjNote(note.text);
  }, [notes]);

  useEffect(() => {
    if (status != state.status) dispatch({ value: status, type: "status" });
    if (reminder != reminderState) setReminderState(reminder);
    if (days != daysState) setDaysState(days);
  }, [status, reminder, days]);

  async function remove() {
    try {
      await globalDispatch(deleteObjective({ ...state, _id }));
      onClose();
    } catch (err) {
      setConfirmDelete(false);
      setError(err);
    }
  }

  async function save() {
    try {
      setSaving(true);
      await globalDispatch(editObjective({ ...state, _id }));
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setSaving(false);
    }
  }

  const handleReminder = (e) => {
    setReminderState(e.target.checked);
  };

  const handleDelete = (tag) => () => {
    const newTags = tags.filter((t) => t != tag);
    handleTagUpdates(newTags, _id);
  };

  const handleChange = (e) => {
    setDaysState(e.target.value);
  };

  const handleDescription = (e) => {
    dispatch({ value: e.target.value, type: "description" });
  };

  const handleDateChange = (date) => {
    dispatch({ value: date, type: "dueDate" });
  };

  const handleStatusChange = (e) => {
    dispatch({ value: e.target.value, type: "status" });
  };

  const saveObjNote = async (text) => {
    let newNote = {
      text: text,
      title: description,
      tags: [],
      objectiveID: _id,
    };
    const note = notes.list.find((n) => n.objectiveID == _id);
    if (note) {
      newNote = { ...note, ...newNote };
      await editNote(newNote);
    } else await createNote(newNote);
  };

  const handleEditClick = async () => {
    if (isEdit) {
      if (objNote) saveObjNote(objNote);
      await editObjective({
        ...objective,
        description: state.description,
        dueDate: state.dueDate,
        status: state.status,
        reminder: reminderState,
        days: reminderState ? daysState : null,
      });
      setSuccess(true);
      setOpen(true);
    }
    setEdit(!isEdit);
  };

  const onChange = (text) => {
    setObjNote(text);
  };

  const getTags = (a) => {};

  useEffect(() => {
    if (account.data) {
      setIsOwner(Boolean(account.data.find((x) => x._id === ownerID)));
      setIsAssignee(Boolean(account.data.find((x) => x._id === assigneeID)));
    }
  }, [account.data]);

  useEffect(() => {
    dispatch({
      type: "update_objective",
      value: {
        organizationID,
        assigneeID,
        status,
        meetingID,
        meetings,
        dueDate,
        description,
        ownerID,
        _id,
        agenda,
        tags,
      },
    });
    note = notes.list.find((n) => n.objectiveID == _id);
    if (note) setObjNote(note.text);
    else setObjNote(null);
  }, [_id]);

  const handleSnackBarClose = () => {
    setOpen(false);
    setSuccess(false);
  };

  const handleLinkClick = (e) => {
    e.preventDefault();
    console.log(
      "handleclicccc",
      meetingID,
      objective.meetingID,
      objective.meetings[0]
    );
    history.push({
      pathname: `/Meetings`,
      search: "",
      state: { selectedMtng: objective.meetings[0] },
    });
  };

  const classes = useStyles();
  const x = users.find((x) => x._id == state.assigneeID);

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          marginTop: "30px",
          overflow: "auto",
          height: "calc(100vh - 94px)",
        }}
      >
        <div style={{ padding: "20px", minWidth: "40vw" }}>
          <Table className={classes.root} aria-label="simple table">
            <TableBody>
              <TableRow key={"objective"}>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  style={{ fontWeight: "2em" }}
                >
                  <h4 style={{ margin: 0 }}>Objective:</h4>
                </TableCell>
                <TableCell align="left">
                  {!isEdit ? (
                    state.description
                  ) : (
                    <TextBox
                      label="Description"
                      name="description"
                      multiline
                      onChange={handleDescription}
                      inputProps={{ rows: 5 }}
                      value={state.description}
                      variant="outlined"
                      style={{ width: 300 }}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow key={"agenda"}>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  style={{ verticalAlign: "top" }}
                >
                  <h4 style={{ margin: 0, marginTop: 20 }}>Agenda:</h4>
                </TableCell>
                <TableCell align="left">
                  {agenda ? (
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: Object.values(agenda)[0],
                        }}
                        style={{ flex: 10, marginTop: 0 }}
                      />
                      <Link
                        style={{
                          textDecoration: "underline",
                          color: "#FFA940",
                          fontFamily: "Italic 16px/22px Helvetica Neue",
                        }}
                        onClick={(e) => handleLinkClick(e)}
                      >
                        <Typography
                          variant="body2"
                          component="p"
                          style={{ paddingTop: 50, paddingRight: 50 }}
                        >
                          Click to view associated meeting
                        </Typography>
                      </Link>
                    </div>
                  ) : (
                    "--"
                  )}
                </TableCell>
              </TableRow>
              <TableRow key={"DueDate"}>
                <TableCell component="th" scope="row" align="right">
                  <h4 style={{ margin: 0 }}>Due Date:</h4>
                </TableCell>
                <TableCell align="left" style={{ fontStyle: "bold" }}>
                  {!isEdit ? (
                    moment.utc(state.dueDate).format("MM/DD/YY")
                  ) : (
                    <DatePicker
                      value={state.dueDate}
                      name="dueDate"
                      label="Due Date"
                      onChange={handleDateChange}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow key={"status"}>
                <TableCell component="th" scope="row" align="right">
                  <h4 style={{ margin: 0 }}>Status</h4>
                </TableCell>
                <TableCell align="left">
                  {!isEdit ? (
                    <Button
                      variant="contained"
                      color="default"
                      className={classes.button}
                    >
                      {state.status}
                    </Button>
                  ) : (
                    <FormControl variant="filled">
                      <Select
                        labelId="demo-simple-select-filled-label"
                        id="demo-simple-select-filled"
                        value={state.status}
                        onChange={handleStatusChange}
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"InProgress"}>In Progress</MenuItem>
                        <MenuItem value={"Completed"}>Completed</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </TableCell>
              </TableRow>
              <TableRow key={"organization"}>
                <TableCell component="th" scope="row" align="right">
                  <div style={{ color: "#808080", width: "100%" }}>
                    Organization:
                  </div>
                </TableCell>
                <TableCell align="left" style={{ fontStyle: "bold" }}>
                  <div style={{ color: "#808080" }}>
                    {organizations[0] && organizations[0].name}
                  </div>
                </TableCell>
              </TableRow>
              <TableRow key={"assignedBy"}>
                <TableCell component="th" scope="row" align="right">
                  <div style={{ color: "#808080", width: "100%" }}>
                    Assigned by:
                  </div>
                </TableCell>
                <TableCell align="left" style={{ fontStyle: "bold" }}>
                  <div style={{ color: "#808080" }}>
                    {x && `${x.firstName} ${x.lastName}`}
                  </div>
                </TableCell>
              </TableRow>

              <TableRow key={"tags"}>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  padding="8px"
                >
                  <div style={{ color: "#808080" }}>Tags:</div>
                </TableCell>
                <TableCell align="left">
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      height: "40px",
                    }}
                  >
                    {tags &&
                      tags.map((tag) => {
                        return (
                          <Chip
                            label={tag}
                            onDelete={handleDelete(tag)}
                            className={classes.chip}
                          />
                        );
                      })}
                    <div style={{ zIndex: 1, marginTop: 7, marginRight: 10 }}>
                      <Tags
                        id={_id}
                        tags={tags}
                        orgTags={
                          organizations[0] &&
                          organizations[0].tags.map((orgTag) => {
                            return { title: orgTag };
                          })
                        }
                        handleTagUpdates={handleTagUpdates}
                        getTags={getTags}
                        icon={"Add icon"}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div
          style={{
            "border-left": "1px solid rgb(112, 112, 112, .47)",
            padding: "20px",
            height: "fit-content",
            minWidth: "30vw",
          }}
        >
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleSnackBarClose}
          >
            <Alert
              onClose={handleSnackBarClose}
              severity={success ? "success" : "error"}
            >
              {success ? "Saved" : "Failed"}
            </Alert>
          </Snackbar>
          <div>
            <Checkbox
              disabled={isEdit ? false : true}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
              name="checkedI"
              onClick={handleReminder}
              checked={reminderState}
            />
            Set up due date reminder
          </div>
          <dv
            style={{
              display: "flex",
              paddingLeft: "40px",
              alignItems: "baseline",
            }}
          >
            <div>Remind Me</div>
            <div style={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <NativeSelect
                id="demo-customized-select-native"
                disabled={isEdit ? false : true}
                value={daysState}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <option value={1}>1 day</option>
                <option value={2}>2 day</option>
                <option value={3}>3 day</option>
                <option value={4}>4 day</option>
                <option value={5}>5 day</option>
                <option value={6}>6 day</option>
                <option value={7}>1 week</option>
              </NativeSelect>
            </div>
            <div>Before due date</div>
          </dv>
          <div style={{ marginLeft: "12px" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <h4 style={{ margin: 0 }}>Add Notes:</h4>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{ margin: 20 }}
                onClick={handleEditClick}
              >
                {!isEdit ? "Edit" : "Save"}
              </Button>
            </div>
            {!isEdit && (
              <Card variant="outlined">
                <CardContent style={{ minHeight: "5vh" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<style> #notes img{ max-width: 250px}</style> <div id="notes">${
                        objNote ? objNote : ""
                      }</div>`,
                    }}
                    style={{ flex: 10 }}
                  />
                </CardContent>
              </Card>
            )}
            {isEdit && (
              <div>
                <div style={{ minWidth: 300 }}>
                  <CKEditor
                    editor={CustomEditor}
                    data={objNote ? objNote : ""}
                    onInit={(editor) => {
                      editor.editing.view.focus();
                    }}
                    config={{
                      ckfinder: {
                        uploadUrl: "/api/upload",
                      },
                    }}
                    onChange={async (event, editor) => {
                      onChange(editor.getData());
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const EditUrlWrapper = ({
  history,
  organizations,
  objective,
  create,
  edit,
  notes,
  editObjective,
  handleTagUpdates,
}) => {
  const { objectives } = useSelector((state) => ({
    objectives: state.objectives,
  }));

  return (
    <EditObjective
      objective={objective}
      organizations={organizations}
      notes={notes}
      createNote={create}
      editObjective={editObjective}
      editNote={edit}
      handleTagUpdates={handleTagUpdates}
    />
  );
};

const mapStateToProps = (state) => {
  return { notes: state.notes };
};

const mapDispatchToProps = (dispatch) => ({
  create: (note) => dispatch(createNote(note)),
  edit: (note) => dispatch(editNote(note)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationHOC(EditUrlWrapper));
