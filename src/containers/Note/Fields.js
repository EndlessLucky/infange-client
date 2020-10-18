// import React, { Component } from "react";
// import CKEditor from "@ckeditor/ckeditor5-react";
// import CustomEditor from "ckeditor";
// import TextBox from "../../controls/TextField";
// import AddTags from "../Meeting/AddTag";
// import moment from "moment";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
// import { InputLabel, Link, Typography } from "@material-ui/core";
// import { SaveButton } from "../../components/controls/Button";
// import { history } from "../../store";
// import Snackbar from "@material-ui/core/Snackbar";
// import MuiAlert from "@material-ui/lab/Alert";
// import PinnedIcon from "../../pin.svg";
// import ShareIcon from "../../add-user.svg";
// import ModalView from "../../components/controls/sharedModal";
// import TextareaAutosize from "@material-ui/core/TextareaAutosize";
// import Checkbox from "@material-ui/core/Checkbox";
// import { connect } from "react-redux";
// import ShareNotes from "./SharedNotes";
// import CreateIcon from "@material-ui/icons/Create";
// import DoneIcon from "@material-ui/icons/Done";
// import ClearIcon from "@material-ui/icons/Clear";
// import PinnedIconYellow from "../../push-pin-yellow.svg";
// import PinnedIconBlack from "../../push-pin-black.svg";

// const Alert = (props) => {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// };

// class UserFields extends Component {
//   state = {
//     open: false,
//     titleField: "",
//     isEdit: false,
//     selectedNoteItem: this.props.selectedNoteItem,
//     isShareNoteModalOpen: false,
//     allowEditing: false,
//     sharedUsers: null,
//     shareMessage: null,
//     shareSucess: false,
//     shareFail: false,
//   };

//   componentDidUpdate = (prevProps) => {
//     if (prevProps.selectedNoteItem != this.state.selectedNoteItem) {
//       this.setState({ selectedNoteItem: this.props.selectedNoteItem });
//       this.forceUpdate();
//     }
//   };

//   sharedTo = (a) => {
//     this.setState({
//       sharedUsers: a,
//     });
//   };

//   handleTitle = (event) => {
//     this.setState({ titleField: event.target.value }, () =>
//       this.props.getTitle(this.state.titleField)
//     );
//   };
//   handleTags = (a, newTag) => {
//     this.setState(
//       {
//         tags: a,
//       },
//       () => {
//         this.props.handleTag(
//           this.state.tags,
//           this.props.selectedNoteItem && this.props.selectedNoteItem._id
//             ? this.props.selectedNoteItem._id
//             : null,
//           newTag
//         );
//       }
//     );
//   };
//   handleEditNoteContent = () => {
//     this.setState({
//       isEdit: !this.state.isEdit,
//     });
//   };
//   getTags = (a) => {
//     this.setState({
//       tags: a,
//     });
//   };
//   handleLinkedObj = (e, id) => {
//     // preventDefault(e);
//     e.preventDefault();
//     history.push({
//       pathname: "/objectives",
//       search: "",
//       state: { selectedObj: id },
//     });
//   };

//   handleOnSave = (e) => {
//     const res = this.props.handleSave(e);
//     if (res) {
//       this.handleEditNoteContent();
//       this.setState({ success: true });
//     }
//     this.setState({ open: true });
//   };

//   handleSnackBarClose = () => {
//     this.setState({ open: false, success: false });
//   };

//   handleShareModalClose = () => {
//     this.setState({
//       isShareNoteModalOpen: false,
//     });
//   };

//   handleSharedNoteEditing = () => {
//     if (this.state.allowEditing) {
//       this.setState({
//         allowEditing: false,
//       });
//     } else {
//       this.setState({
//         allowEditing: true,
//       });
//     }
//   };

//   handleShareMessage = (event) => {
//     this.setState({
//       shareMessage: event.target.value,
//     });
//   };

//   onShareNote = async () => {
//     let sharedUsersID = [];
//     this.state.sharedUsers.map((u) => {
//       const user = this.props.users.byID[u];
//       sharedUsersID.push(user.clientID);
//     });
//     const data = {
//       shared: sharedUsersID,
//       message: this.state.shareMessage,
//       allowEdit: this.state.allowEditing,
//     };
//     try {
//       const response = await fetch(
//         `/api/notes/${this.state.selectedNoteItem._id}/share`,
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//           method: "PATCH",
//           body: JSON.stringify(data),
//         }
//       );

//       if (response.status === 200) {
//         this.setState({
//           isShareNoteModalOpen: false,
//           shareSucess: true,
//         });
//       } else {
//         this.setState({
//           isShareNoteModalOpen: false,
//           shareFail: true,
//         });
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   closeSnackSucess = () => {
//     this.setState({
//       shareSucess: false,
//     });
//   };

//   closeSnackFail = () => {
//     this.setState({
//       shareFail: false,
//     });
//   };

//   render() {
//     const {
//       onChange,
//       selectedNoteItem,
//       text,
//       children,
//       title,
//       fromEdit,
//       orgTags,
//       handleSave,
//       pending,
//     } = this.props;

//     // let shared =
//     let sharedUser =
//       this.props.selectedNoteItem &&
//       this.props.selectedNoteItem.shared.includes(`${localStorage.clientID}`) &&
//       this.props.users.profiles.find(
//         (u) => u.clientID == this.props.selectedNoteItem.clientID
//       );

//     return (
//       <React.Fragment>
//         <Snackbar
//           open={this.state.shareSucess}
//           autoHideDuration={3000}
//           onClose={this.closeSnackSucess}
//         >
//           <Alert onClose={this.closeSnackSucess} severity="info">
//             Note shared
//           </Alert>
//         </Snackbar>
//         <Snackbar
//           open={this.state.shareFail}
//           autoHideDuration={3000}
//           onClose={this.closeSnackFail}
//         >
//           <Alert onClose={this.closeSnackFail} severity="error">
//             Oops something went wrong!
//           </Alert>
//         </Snackbar>
//         <ModalView
//           open={this.state.isShareNoteModalOpen}
//           onClose={this.handleShareModalClose}
//           title="Share Note"
//           style={{
//             height: "440px",
//             width: "440px",
//             position: "fixed",
//             left: "50%",
//             top: "50%",
//             marginTop: "-250px",
//             marginLeft: "-250px",
//           }}
//         >
//           <div style={{ overflowY: "auto", maxHeight: 600 }}>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 paddingTop: 10,
//               }}
//             >
//               <div>
//                 {/* <Typography>Message</Typography>
//                                 <TextareaAutosize label="Message" rowsMin={6} placeholder="Optional" style={{width: '32vw'}}/> */}
//                 <ShareNotes
//                   users={this.props.users.ddl}
//                   sharedTo={this.sharedTo}
//                   sharedUsers={this.state.sharedUsers}
//                 />
//                 <div>
//                   <Typography>Message</Typography>
//                   <TextareaAutosize
//                     label="Message"
//                     rowsMin={6}
//                     placeholder="Optional"
//                     style={{ width: "100%" }}
//                     value={this.state.shareMessage}
//                     onChange={this.handleShareMessage}
//                   />
//                 </div>
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <Checkbox
//                     color="default"
//                     inputProps={{ "aria-label": "checkbox with default color" }}
//                     onChange={this.handleSharedNoteEditing}
//                   />
//                   <Typography>Allow editing</Typography>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginRight: 60,
//               marginBottom: 30,
//               alignItems: "center",
//             }}
//           >
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={this.onShareNote}
//             >
//               Share
//             </Button>
//           </div>
//         </ModalView>
//         <div
//           style={{
//             height: fromEdit ? "90vh" : null,
//             overflow: fromEdit ? "scroll" : null,
//           }}
//         >
//           {!fromEdit && (
//             <div style={{ margin: "20px" }}>
//               <div style={{ marginBottom: "20px" }}>
//                 <tr>
//                   <td style={{ verticalAlign: "middle" }}>
//                     <InputLabel style={{ marginRight: 20 }}>Title</InputLabel>
//                   </td>
//                   <td>
//                     <TextBox
//                       label="Title"
//                       fullWidth
//                       name="title"
//                       value={
//                         this.state.titleField ? this.state.titleField : title
//                       }
//                       onChange={this.handleTitle}
//                       variant="outlined"
//                       style={{ width: "390px" }}
//                     />
//                   </td>
//                 </tr>
//               </div>
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <InputLabel style={{ marginRight: 22 }}>Note</InputLabel>
//                   <div style={{ width: 400 }}>
//                     <CKEditor
//                       editor={CustomEditor}
//                       data={text}
//                       onInit={(editor) => {
//                         editor.editing.view.focus();
//                       }}
//                       config={{
//                         ckfinder: {
//                           uploadUrl: "/api/upload",
//                         },
//                       }}
//                       onBlur={async (event, editor) => {
//                         onChange(editor.getData());
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div style={{ marginBottom: "20px" }}>
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <InputLabel style={{ marginRight: 22 }}>Tags</InputLabel>
//                   <AddTags
//                     handleTags={this.props.handleTag}
//                     tags={[]}
//                     orgTags={orgTags}
//                     createNote={true}
//                   />
//                 </div>
//               </div>
//               {children}
//             </div>
//           )}
//           {fromEdit && (
//             <div style={{ margin: "40px", width: "58vw" }}>
//               <div style={{ display: "flex", alignItems: "center" }}>
//                 <div
//                   onClick={() =>
//                     this.props.handleSave(
//                       !this.props.selectedNoteItem.pinned,
//                       true
//                     )
//                   }
//                 >
//                   {this.props.selectedNoteItem.pinned && (
//                     <img
//                       src={PinnedIconYellow}
//                       style={{ transform: "rotate(300deg)", width: 20 }}
//                     />
//                   )}
//                   {!this.props.selectedNoteItem.pinned && (
//                     <img
//                       src={PinnedIconBlack}
//                       style={{ transform: "rotate(300deg)", width: 20 }}
//                     />
//                   )}
//                 </div>
//                 {!sharedUser && (
//                   <div
//                     style={{ marginLeft: 15, marginTop: 5 }}
//                     onClick={() =>
//                       this.setState({ isShareNoteModalOpen: true })
//                     }
//                   >
//                     <img src={ShareIcon} width="17px" />
//                   </div>
//                 )}
//                 {sharedUser && (
//                   <div
//                     style={{ color: "#FFA940", fontSize: 11, marginLeft: 10 }}
//                   >
//                     {sharedUser.firstName +
//                       " " +
//                       sharedUser.lastName +
//                       " has shared this note with you"}
//                   </div>
//                 )}
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "baseline",
//                 }}
//               >
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center" }}>
//                     <div style={{ fontSize: 14, fontWeight: "bold" }}>
//                       {this.state.isEdit ? (
//                         <TextBox
//                           id="title"
//                           variant="outlined"
//                           style={{ width: "300px" }}
//                           defaultValue={
//                             this.props.selectedNoteItem
//                               ? this.props.selectedNoteItem.title
//                               : ""
//                           }
//                           onChange={this.props.handleTitleChange}
//                         />
//                       ) : this.props.selectedNoteItem ? (
//                         this.props.selectedNoteItem.title
//                       ) : (
//                         title
//                       )}
//                     </div>
//                     {(!sharedUser || this.props.selectedNoteItem.allowEdit) && (
//                       <div>
//                         {!this.state.isEdit ? (
//                           <CreateIcon
//                             style={{ width: 15 }}
//                             onClick={this.handleEditNoteContent}
//                           />
//                         ) : (
//                           <div>
//                             {" "}
//                             <DoneIcon
//                               style={{ width: 20 }}
//                               color={"primary"}
//                               onClick={this.handleOnSave}
//                             />{" "}
//                             <ClearIcon
//                               style={{ width: 20 }}
//                               onClick={this.handleEditNoteContent}
//                             />{" "}
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                   <div style={{ display: "flex", flexWrap: "nowrap" }}>
//                     <p>
//                       {moment(
//                         this.props.selectedNoteItem
//                           ? this.props.selectedNoteItem.createDate
//                           : this.props.createDate
//                       ).format("MM/DD/YY")}{" "}
//                     </p>
//                     {this.props.selectedNoteItem &&
//                       this.props.selectedNoteItem.objectiveID && (
//                         <div style={{ marginTop: 15, marginLeft: 5 }}>
//                           {" "}
//                           -{" "}
//                           <Link
//                             href="#"
//                             onClick={(e) =>
//                               this.handleLinkedObj(
//                                 e,
//                                 this.props.selectedNoteItem.objectiveID
//                               )
//                             }
//                             color="primary"
//                             underline="always"
//                           >
//                             Click to view linked objective
//                           </Link>{" "}
//                         </div>
//                       )}
//                   </div>
//                 </div>
//                 <div>
//                   {selectedNoteItem && (
//                     <AddTags
//                       handleTags={this.handleTags}
//                       tags={selectedNoteItem.tags}
//                       id={selectedNoteItem.id}
//                       orgTags={orgTags}
//                       width={"250px"}
//                     />
//                   )}
//                 </div>
//               </div>
//               {!this.state.isEdit && (
//                 <Card variant="outlined">
//                   <Snackbar
//                     open={this.state.open}
//                     autoHideDuration={6000}
//                     onClose={this.handleSnackBarClose}
//                   >
//                     <Alert
//                       onClose={this.handleSnackBarClose}
//                       severity={this.state.success ? "success" : "error"}
//                     >
//                       {this.state.success ? "Saved" : "Failed"}
//                     </Alert>
//                   </Snackbar>
//                   <CardContent>
//                     <div
//                       dangerouslySetInnerHTML={{
//                         __html: `<style> #notes img{ max-width: 250px}</style> <div id="notes">${
//                           this.props.selectedNoteItem
//                             ? this.props.selectedNoteItem.text
//                             : this.props.text
//                         }</div>`,
//                       }}
//                       style={{ flex: 10 }}
//                     />
//                   </CardContent>
//                 </Card>
//               )}
//               {this.state.isEdit && (
//                 <div>
//                   <div style={{ minWidth: 600 }}>
//                     <CKEditor
//                       editor={CustomEditor}
//                       data={
//                         this.props.selectedNoteItem
//                           ? this.props.selectedNoteItem.text
//                           : text
//                       }
//                       onInit={(editor) => {
//                         editor.editing.view.focus();
//                       }}
//                       config={{
//                         ckfinder: {
//                           uploadUrl: "/api/upload",
//                         },
//                       }}
//                       onChange={async (event, editor) => {
//                         onChange(editor.getData(), true);
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   let users = state.users;
//   users.profiles = [];
//   let i = 0,
//     keys = Object.keys(state.users.byID);
//   while (i < keys.length) {
//     users.profiles.push(users.byID[keys[i]]);
//     i++;
//   }
//   console.log(
//     "checkkkk",
//     users.profiles,
//     keys,
//     state.users.byID,
//     Object.keys(state.users.byID)
//   );
//   return { users: users, meetings: state.meetings.list };
// };

// export default connect(mapStateToProps)(UserFields);

import React, { Component } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import CustomEditor from "ckeditor";
import TextBox from "../../controls/TextField";
import AddTags from "../Meeting/AddTag";
import moment from "moment";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { InputLabel, Link, Typography } from "@material-ui/core";
import { SaveButton } from "../../components/controls/Button";
import { history } from "../../store";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import PinnedIcon from "../../pin.svg";
import ShareIcon from "../../add-user.svg";
import ModalView from "../../components/controls/sharedModal";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Checkbox from "@material-ui/core/Checkbox";
import { connect } from "react-redux";
import ShareNotes from "./SharedNotes";
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import PinnedIconYellow from "../../push-pin-yellow.svg";
import PinnedIconBlack from "../../push-pin-black.svg";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

class UserFields extends Component {
  state = {
    open: false,
    titleField: "",
    isEdit: false,
    selectedNoteItem: this.props.selectedNoteItem,
    isShareNoteModalOpen: false,
    allowEditing: false,
    sharedUsers: null,
    shareMessage: null,
    shareSucess: false,
    shareFail: false,
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.selectedNoteItem != this.state.selectedNoteItem) {
      this.setState({ selectedNoteItem: this.props.selectedNoteItem });
      this.forceUpdate();
    }
  };

  sharedTo = (a) => {
    this.setState({
      sharedUsers: a,
    });
  };

  handleTitle = (event) => {
    this.setState({ titleField: event.target.value }, () =>
      this.props.getTitle(this.state.titleField)
    );
  };
  handleTags = (a, newTag) => {
    this.setState(
      {
        tags: a,
      },
      () => {
        this.props.handleTag(
          this.state.tags,
          this.props.selectedNoteItem && this.props.selectedNoteItem._id
            ? this.props.selectedNoteItem._id
            : null,
          newTag
        );
      }
    );
  };
  handleEditNoteContent = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };
  getTags = (a) => {
    this.setState({
      tags: a,
    });
  };
  handleLinkedObj = (e, id) => {
    // preventDefault(e);
    e.preventDefault();
    history.push({
      pathname: "/objectives",
      search: "",
      state: { selectedObj: id },
    });
  };

  handleOnSave = (e) => {
    const res = this.props.handleSave(e);
    if (res) {
      this.handleEditNoteContent();
      this.setState({ success: true });
    }
    this.setState({ open: true });
  };

  handleSnackBarClose = () => {
    this.setState({ open: false, success: false });
  };

  handleShareModalClose = () => {
    this.setState({
      isShareNoteModalOpen: false,
    });
  };

  handleSharedNoteEditing = () => {
    if (this.state.allowEditing) {
      this.setState({
        allowEditing: false,
      });
    } else {
      this.setState({
        allowEditing: true,
      });
    }
  };

  handleShareMessage = (event) => {
    this.setState({
      shareMessage: event.target.value,
    });
  };

  onShareNote = async () => {
    let sharedUsersID = [];
    this.state.sharedUsers.map((u) => {
      const user = this.props.users.byID[u];
      sharedUsersID.push(user.clientID);
    });
    const data = {
      shared: sharedUsersID,
      message: this.state.shareMessage,
      allowEdit: this.state.allowEditing,
    };
    try {
      const response = await fetch(
        `/api/notes/${this.state.selectedNoteItem._id}/share`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PATCH",
          body: JSON.stringify(data),
        }
      );

      if (response.status === 200) {
        this.setState({
          isShareNoteModalOpen: false,
          shareSucess: true,
        });
      } else {
        this.setState({
          isShareNoteModalOpen: false,
          shareFail: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  closeSnackSucess = () => {
    this.setState({
      shareSucess: false,
    });
  };

  closeSnackFail = () => {
    this.setState({
      shareFail: false,
    });
  };

  render() {
    const {
      onChange,
      selectedNoteItem,
      text,
      children,
      title,
      fromEdit,
      orgTags,
      handleSave,
      pending,
    } = this.props;
    let sharedUser =
      this.props.selectedNoteItem &&
      this.props.selectedNoteItem.shared.includes(`${localStorage.clientID}`) &&
      this.props.users.profiles.find(
        (u) => u.clientID == this.props.selectedNoteItem.clientID
      );
    return (
      <React.Fragment>
        <Snackbar
          open={this.state.shareSucess}
          autoHideDuration={3000}
          onClose={this.closeSnackSucess}
        >
          <Alert onClose={this.closeSnackSucess} severity="info">
            Note shared
          </Alert>
        </Snackbar>
        <Snackbar
          open={this.state.shareFail}
          autoHideDuration={3000}
          onClose={this.closeSnackFail}
        >
          <Alert onClose={this.closeSnackFail} severity="error">
            Oops something went wrong!
          </Alert>
        </Snackbar>
        <ModalView
          open={this.state.isShareNoteModalOpen}
          onClose={this.handleShareModalClose}
          title="Share Note"
          style={{
            height: "440px",
            width: "440px",
            position: "fixed",
            left: "50%",
            top: "50%",
            marginTop: "-250px",
            marginLeft: "-250px",
          }}
        >
          <div style={{ overflowY: "auto", maxHeight: 600 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 10,
              }}
            >
              <div>
                <ShareNotes
                  users={this.props.users.ddl}
                  sharedTo={this.sharedTo}
                  sharedUsers={this.state.sharedUsers}
                />
                <div>
                  <Typography>Message</Typography>
                  <TextareaAutosize
                    label="Message"
                    rowsMin={6}
                    placeholder="Optional"
                    style={{ width: "100%" }}
                    value={this.state.shareMessage}
                    onChange={this.handleShareMessage}
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Checkbox
                    color="default"
                    inputProps={{ "aria-label": "checkbox with default color" }}
                    onChange={this.handleSharedNoteEditing}
                  />
                  <Typography>Allow editing</Typography>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 60,
              marginBottom: 30,
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={this.onShareNote}
            >
              Share
            </Button>
          </div>
        </ModalView>
        <div
          style={{
            height: fromEdit ? "calc(100vh - 64px)" : null,
            overflow: fromEdit ? "scroll" : null,
            width: fromEdit ? "66vw" : null,
          }}
        >
          {!fromEdit && (
            <div style={{ margin: "20px" }}>
              <div style={{ marginBottom: "20px" }}>
                <tr>
                  <td style={{ verticalAlign: "middle" }}>
                    <InputLabel style={{ marginRight: 20 }}>Title</InputLabel>
                  </td>
                  <td>
                    <TextBox
                      label="Title"
                      fullWidth
                      name="title"
                      value={
                        this.state.titleField ? this.state.titleField : title
                      }
                      onChange={this.handleTitle}
                      variant="outlined"
                      style={{ width: "390px" }}
                    />
                  </td>
                </tr>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <InputLabel style={{ marginRight: 22 }}>Note</InputLabel>
                  <div style={{ width: 400 }}>
                    <CKEditor
                      editor={CustomEditor}
                      data={text}
                      onInit={(editor) => {
                        editor.editing.view.focus();
                      }}
                      config={{
                        ckfinder: {
                          uploadUrl: "/api/upload",
                        },
                      }}
                      onBlur={async (event, editor) => {
                        onChange(editor.getData());
                      }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <InputLabel style={{ marginRight: 22 }}>Tags</InputLabel>
                  <AddTags
                    handleTags={this.props.handleTag}
                    tags={[]}
                    orgTags={orgTags}
                    createNote={true}
                  />
                </div>
              </div>
              {children}
            </div>
          )}
          {fromEdit && (
            <div style={{ margin: "40px", width: "58vw" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  onClick={() =>
                    this.props.handleSave(
                      !this.props.selectedNoteItem.pinned,
                      true
                    )
                  }
                >
                  {this.props.selectedNoteItem.pinned && (
                    <img
                      src={PinnedIconYellow}
                      style={{ transform: "rotate(300deg)", width: 20 }}
                    />
                  )}
                  {!this.props.selectedNoteItem.pinned && (
                    <img
                      src={PinnedIconBlack}
                      style={{ transform: "rotate(300deg)", width: 20 }}
                    />
                  )}
                </div>
                {!sharedUser && (
                  <div
                    style={{ marginLeft: 15, marginTop: 5 }}
                    onClick={() =>
                      this.setState({ isShareNoteModalOpen: true })
                    }
                  >
                    <img src={ShareIcon} width="17px" />
                  </div>
                )}
                {sharedUser && (
                  <div
                    style={{ color: "#FFA940", fontSize: 11, marginLeft: 10 }}
                  >
                    {sharedUser.firstName +
                      " " +
                      sharedUser.lastName +
                      " has shared this note with you"}
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: "bold" }}>
                      {this.state.isEdit ? (
                        <TextBox
                          id="title"
                          variant="outlined"
                          style={{ width: "300px" }}
                          defaultValue={
                            this.props.selectedNoteItem
                              ? this.props.selectedNoteItem.title
                              : ""
                          }
                          onChange={this.props.handleTitleChange}
                        />
                      ) : this.props.selectedNoteItem ? (
                        this.props.selectedNoteItem.title
                      ) : (
                        title
                      )}
                    </div>
                    {(!sharedUser || this.props.selectedNoteItem.allowEdit) && (
                      <div>
                        {!this.state.isEdit ? (
                          <CreateIcon
                            style={{ width: 15 }}
                            onClick={this.handleEditNoteContent}
                          />
                        ) : (
                          <div>
                            {" "}
                            <DoneIcon
                              style={{ width: 20 }}
                              color={"primary"}
                              onClick={this.handleOnSave}
                            />{" "}
                            <ClearIcon
                              style={{ width: 20 }}
                              onClick={this.handleEditNoteContent}
                            />{" "}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", flexWrap: "nowrap" }}>
                    <p>
                      {moment(
                        this.props.selectedNoteItem
                          ? this.props.selectedNoteItem.createDate
                          : this.props.createDate
                      ).format("MM/DD/YY")}{" "}
                    </p>
                    {this.props.selectedNoteItem &&
                      this.props.selectedNoteItem.objectiveID && (
                        <div style={{ marginTop: 15, marginLeft: 5 }}>
                          {" "}
                          -{" "}
                          <Link
                            href="#"
                            onClick={(e) =>
                              this.handleLinkedObj(
                                e,
                                this.props.selectedNoteItem.objectiveID
                              )
                            }
                            color="primary"
                            underline="always"
                          >
                            Click to view linked objective
                          </Link>{" "}
                        </div>
                      )}
                  </div>
                </div>
                <div>
                  {selectedNoteItem && (
                    <AddTags
                      handleTags={this.handleTags}
                      tags={selectedNoteItem.tags}
                      id={selectedNoteItem.id}
                      orgTags={orgTags}
                      width={"250px"}
                    />
                  )}
                </div>
              </div>
              {!this.state.isEdit && (
                <Card variant="outlined">
                  <Snackbar
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleSnackBarClose}
                  >
                    <Alert
                      onClose={this.handleSnackBarClose}
                      severity={this.state.success ? "success" : "error"}
                    >
                      {this.state.success ? "Saved" : "Failed"}
                    </Alert>
                  </Snackbar>
                  <CardContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `<style> #notes img{ max-width: 250px}</style> <div id="notes">${
                          this.props.selectedNoteItem
                            ? this.props.selectedNoteItem.text
                            : this.props.text
                        }</div>`,
                      }}
                      style={{ flex: 10 }}
                    />
                  </CardContent>
                </Card>
              )}
              {this.state.isEdit && (
                <div>
                  <div style={{ minWidth: 600 }}>
                    <CKEditor
                      editor={CustomEditor}
                      data={
                        this.props.selectedNoteItem
                          ? this.props.selectedNoteItem.text
                          : text
                      }
                      onInit={(editor) => {
                        editor.editing.view.focus();
                      }}
                      config={{
                        ckfinder: {
                          uploadUrl: "/api/upload",
                        },
                      }}
                      onChange={async (event, editor) => {
                        onChange(editor.getData(), true);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let users = state.users;
  users.profiles = [];
  let i = 0,
    keys = Object.keys(state.users.byID);
  while (i < keys.length) {
    users.profiles.push(users.byID[keys[i]]);
    i++;
  }
  console.log(
    "checkkkk",
    users.profiles,
    keys,
    state.users.byID,
    Object.keys(state.users.byID)
  );
  return { users: users, meetings: state.meetings.list };
};

export default connect(mapStateToProps)(UserFields);
