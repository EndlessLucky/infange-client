import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomEditor from "ckeditor";
import Paper from "@material-ui/core/Paper";
import CKEditor from "@ckeditor/ckeditor5-react";
import AgendaTypeIcons from "./AgendaTypeIcons";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import DeleteIcon from "@material-ui/icons/Delete";
import { createTopic } from "../../actions/topic";
import { UserAvatar } from "../../containers/Avatar";
import { AccountHOC } from "../../context/AccountProvider";
// import Modal from '../../components/controls/Modal';
import AddObjective from "../Objective/Create";
import { Add } from "@material-ui/icons";
import MuiModal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import Link from "@material-ui/core/Link";
import "../../index.css";
import { history } from "../../store";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Modal from "@material-ui/core/Modal";
import ModalView from "../../components/controls/Modal";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Checkbox from "@material-ui/core/Checkbox";
// import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "80%",
    "max-height": "82%",
    overflow: "scroll",
  },
  paper: {
    // marginBottom: "8px",
    display: "flex",
    "& p": {
      marginTop: 14,
    },
    "& .ck-editor": {
      width: "100%",
    },
    justifyContent: "space-between",
  },
  icon: {
    padding: 12,
    flex: "0 0 auto",
    height: "24px",
  },
  drag: {
    // color: "#999",
    padding: theme.spacing(1.2),
    flex: "0 0 auto",
  },
  type: {
    flex: "0 0 auto",
  },
  textEdit: {
    flex: "1 1 auto",
    paddingLeft: theme.spacing(3),
  },
  handle: {
    height: 54,
  },
  indentArrows: {
    fontSize: "20px",
    hegith: "15px",
    cursor: "pointer",
    padding: "4px",
  },
  indentDiv: {
    display: "flex",
    "line-height": "20px",
    justifyContent: "center",
  },
  popup: {
    boxShadow: `rgba(0, 0, 0, 0.4) 1px 1px 5px 5px`,
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    overflow: "scroll",
  },
  img: {
    "& img": {
      "max-width": "70%",
    },
  },
}));

const EditableAgenda = (
  {
    meetingID,
    agenda,
    onChange,
    canEdit = false,
    draggable = false,
    onCheck,
    account,
    objectives,
    mtng,
    indent,
    isDragging,
    ended,
    isMember,
    firstUnchecked,
  },
  ref
) => {
  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);
  const [newData, setNewData] = useState(false);
  const [objectiveIsOpen, setObjectiveIsOpen] = useState(false);
  const editorRef = React.createRef();
  const [agenDA, setagenDA] = useState("");
  const [agendaID, setAgendaID] = useState("");
  const [editorData, setEditorData] = useState(null);
  // Either this will call an action or you will pull your agendas out of global state

  async function saveData(data, indent) {
    let body, a;
    if (data) {
      body = { doc: data };
      a = { ...agenda, doc: data };
    } else {
      a = { ...agenda, indent };
      body = { indent };
    }
    a = { ...agenda, indent };
    await axios.patch(`/api/meetings/${meetingID}/agendas/${agenda._id}`, body);
    onChange(a);
  }
  const getObjective = (objID) => {
    mtng.agendas.forEach((agnd) => {
      if (agnd._id === agenda._id) {
        const sss = objectives.find((ob) => {
          return ob._id === objID;
        });
        let objective = {};
        objective[`${objID}`] = sss.description;
        // agenda.objectiveID.push(objective)
        agenda.objectiveID.splice(0, 0, objective);
        agnd.objectiveID = agenda.objectiveID;
      }
    });
    linkObjectiveAndMeeting();
  };

  const linkObjectiveAndMeeting = async () => {
    await axios.put(`/api/meetings/${meetingID}`, mtng);
    setObjectiveIsOpen(false);
  };

  const onclickAgenda = (a, id) => {
    setAgendaID(id);
    setagenDA(a);
    // setObjectiveIsOpen(true)
    history.push("/AddObjective", {
      hideorg: true,
      meetingID: meetingID,
      organizationID: mtng.organizationID,
      linkOpen: true,
      agenDA: a,
      agendaID: id,
      mtng: mtng,
      agenda: agenda,
      objectives: objectives,
    });
  };
  const handleIndentation = async (direction) => {
    if (direction === "left" && indent > 0) await saveData(false, --indent);
    else if (direction === "right") await saveData(false, ++indent);
  };

  const handleObjectiveClick = async (id) => {
    history.push({
      pathname: "/objectives",
      search: "",
      state: { selectedObj: id },
    });
  };

  const saveEditorData = async (data) => {
    if (newData) {
      setNewData(false);
      await saveData(editorData);
    }
    setEditMode(false);
  };

  const handleNewObjective = (a, id) => {
    setAgendaID(id);
    setagenDA(a);
    setObjectiveIsOpen(true);
  };

  const handleCloseObjective = () => {
    setObjectiveIsOpen(false);
  };
  return (
    <React.Fragment>
      <ModalView
        open={objectiveIsOpen}
        onClose={handleCloseObjective}
        title="Create Objective"
        style={{
          height: "600px",
          width: "550px",
          position: "fixed",
          left: "50%",
          top: "42%",
          marginTop: "-250px",
          marginLeft: "-250px",
        }}
      >
        <div style={{ overflowY: "auto", maxHeight: 600 }}>
          <AddObjective
            onComplete={(e) => setObjectiveIsOpen(false)}
            hideorg={true}
            meetingID={meetingID}
            organizationID={mtng.organizationID}
            getObjective={getObjective}
            linkOpen={true}
            agenDA={agenDA}
            agendaID={agendaID}
          />
        </div>
      </ModalView>
      <Paper
        className={
          isDragging
            ? clsx(classes.paper, classes.drag, classes.popup)
            : clsx(classes.paper, classes.drag)
        }
        style={{
          alignItems: "right",
          marginLeft: `${indent * 5}%`,
          width: `${100 - indent * 5}%`,
          minWidth: "fit-content",
          border: "#FFA940",
          borderWidth: firstUnchecked ? 1 : 0,
          borderStyle: "solid",
        }}
      >
        {canEdit && (
          <div style={{ textAlign: "left" }} className={classes.paper}>
            <div className={classes.indentDiv}>
              {indent > 0 && (
                <div
                  className={classes.indentArrows}
                  onClick={() => handleIndentation("left")}
                >
                  {"<"}
                </div>
              )}
              {indent < 12 && (
                <div
                  className={classes.indentArrows}
                  onClick={() => handleIndentation("right")}
                >
                  {">"}
                </div>
              )}
            </div>
          </div>
        )}

        {!editMode ? (
          <>
            {" "}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "inherit",
                fontSize: 11,
              }}
            >
              <div
                className={classes.img}
                dangerouslySetInnerHTML={{ __html: agenda.doc }}
                style={{ flex: 10 }}
                onClick={() => setEditMode(canEdit)}
              />
            </div>
          </>
        ) : (
          <MuiModal
            className={classes.modal}
            open={true}
            onClose={() => {
              newData ? saveEditorData() : setEditMode(false);
            }}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={true}>
              <div className={classes.modalPaper}>
                <CKEditor
                  className={classes.textEdit}
                  editor={CustomEditor}
                  data={agenda.doc}
                  config={{
                    ckfinder: {
                      uploadUrl: "/api/upload",
                    },
                  }}
                  ref={editorRef}
                  onInit={(editor) => {
                    editor.editing.view.focus();
                  }}
                  onChange={async (event, editor) => {
                    setNewData(true);
                    setEditorData(editor.getData());
                  }}
                  onFocus={(editor) => {
                    console.log("Focus.", editor);
                  }}
                />
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                  onClick={() => handleNewObjective(agenda.doc, agenda._id)}
                >
                  <Add />
                </div>
              </div>
            </Fade>
          </MuiModal>
        )}
        {!ended && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50px",
              alignItems: "center",
              justifyContent: "space-between",
              height: "inherit",
            }}
          >
            <div>
              {isMember && (
                <Checkbox
                  id={agenda._id}
                  checked={agenda.discussed}
                  disabled={isMember ? false : true}
                  icon={
                    <CheckBoxOutlineBlankIcon
                      fontSize="small"
                      style={{ width: 15 }}
                    />
                  }
                  checkedIcon={
                    <CheckBoxIcon fontSize="small" style={{ width: 15 }} />
                  }
                  onClick={onCheck}
                />
              )}
            </div>

            {
              /*!agenda.objectiveID[0]&&*/ <div
                onClick={() => handleNewObjective(agenda.doc, agenda._id)}
              >
                <Add style={{ width: 15, fill: "#FFA940" }} />
              </div>
            }
          </div>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default AccountHOC(EditableAgenda);
