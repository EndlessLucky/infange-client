import React, { Fragment, Component } from "react";
import { makeAspectCrop } from "avatar-image";
import ReactCrop from "avatar-image";
import "avatar-image/dist/ReactCrop.css";
import { connect } from "react-redux";
import Fields from "../User/Fields";
import { editUser } from "../../actions/user";
import { createAvatar } from "../../actions/profile";
import { IconButton } from "../../components/controls/Button";
import Box from "../../components/controls/Box";
import { PhotoCamera } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";
import ContactInformation from "./ProfileOrganizations";
import ImageUpload from "../../components/controls/Upload/Image";
import Avatar from "@material-ui/core/Avatar";
import { SaveButton } from "../../components/controls/Button";
import { OrganizationHOC } from "../../context/OrganizationProvider";
import { useOrganizations } from "../../context/OrganizationProvider";
import DateTimeBar from "../../containers/dashboard/DateTimeBar";
import Modal from "@material-ui/core/Modal";
import SelectImage from "./SelectImage";
import Popover from "@material-ui/core/Popover";
import UserAvatar from "react-avatar";
import EditIcon from "@material-ui/icons/Create";
import MailIcon from "@material-ui/icons/Email";
import CallIcon from "@material-ui/icons/Call";
import Input from "@material-ui/core/Input";
import "../../styles/index.css";
import DoneIcon from "@material-ui/icons/Done";

const axios = require("axios").default;

/**
 * @param {File} image - Image File Object
 * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
 * @param {String} fileName - Name of the returned file in Promise
 */

function getCroppedImg(image, pixelCrop) {
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.arc(
    pixelCrop.width / 2,
    pixelCrop.height / 2,
    pixelCrop.width,
    0,
    Math.PI * 2,
    true
  );
  ctx.clip();
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // As Base64 string
  const base64Image = canvas.toDataURL("image/jpeg");

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      //file.name = fileName;
      resolve(file);
    }, "image/jpeg");
  });
}

const styles = (theme) => ({
  rightPortion: {
    display: "block",
    width: "100%",
    maxWidth: 500,
    position: "absolute",
    zIndex: "1",
    right: "0px",
    top: 56,
    backgroundColor: "#D3D3D3",
  },
  photoIcon: {
    backgroundColor: "dimgrey",
    position: "relative",
    backgroundColor: "#fff",
    top: -25,
    left: 175,
    width: "2em",
    height: "2em",
    boxShadow: "1px 1px 5px 3px #ccc",
    cursor: "pointer",
    // zIndex: 1500
  },
  photoCamera: {
    fontSize: 20,
    // backgroundColor: 'grey'
  },
  box: {
    marginLeft: "20px",
  },
});
let br = [];

class Profile extends Component {
  state = {
    crop: {
      x: 20,
      y: 20,
      width: 30,
      height: 30,
      aspect: 1,
    },
    pending: false,
    loading: false,
    dataUrl: null,
    image: null,
    newImage: null,
    open: false,
    information: "",
    firstName: "",
    lastName: "",
    nickName: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
    },
    contact: [
      {
        type: "email",
        info: "",
      },
      {
        type: "phone",
        info: "",
      },
    ],
    displayCrop: false,
    openCrop: false,
    pro: null,
    updatedTime: new Date(),
    editContactInfo: false,
    updatePrimry: false,
    isContact: false,
  };

  onImageLoaded = (image) => {
    this.setState({
      crop: makeAspectCrop(
        {
          x: 0,
          y: 0,
          aspect: 1,
          width: 50,
        },
        image.width / image.height
      ),
      image,
    });
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  onCropComplete = (crop, pixelCrop) => {
    this.setState({ pixelCrop });
  };

  handleUpload = (dataUrl) => {
    this.setState({ dataUrl, displayCrop: true });
  };

  uploadImage = async () => {
    const { image, pixelCrop } = this.state;
    if (pixelCrop) {
      let cropped = await getCroppedImg(image, pixelCrop);
      try {
        this.setState({ pending: true, newImage: cropped });
        const response = await this.props.create(
          this.props.organizations[0].id,
          cropped
        );
        if (response) {
          this.setState({ updatedTime: new Date() });
          this.props.updateAvatar();
        }
        this.setState({ pending: false, displayCrop: false });
      } catch (err) {
        console.warn(err);
        this.setState({ pending: false });
      }
    }
  };

  handleProfileChange = (profile) => {
    // console.log("proz", profile);
    this.setState({
      profile,
    });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleComplete = async (p) => {
    let profile = { ...this.state.profile, ...p };
    try {
      await this.props.update(profile);
      this.setState({ profile });
    } catch (e) {
      console.log(e);
    }
  };

  handleShowDialog = () => {
    this.setState({ open: !this.state.open });
  };

  handleClickProfile = () => {
    // this.toggleCropModal();
    const fileInstance = document.getElementById("profileUpload");
    fileInstance.click();
  };

  toggleCropModal = () => {
    // console.log("crop", this.state.openCrop);
    if (!this.state.openCrop) this.handleProfileChange();
    this.setState((state) => {
      return {
        openCrop: !state.openCrop,
      };
    });
  };

  getProfile = (a) => {
    this.setState({
      pro: a,
    });
  };

  handleMailId = (event) => {
    // console.log("...", event.target.value);
    this.setState({
      contactEmail: event.target.value,
    });
  };

  handleContactNo = (event) => {
    // console.log("...", event.target.value);
    this.setState({
      contactNo: event.target.value,
    });
  };

  handleCloseEdit = () => {
    this.setState({ editContactInfo: false });
  };

  updatePrimaryInfo = async () => {
    this.handleCloseEdit();
    if (this.state.contactNo === "") {
      this.setState({
        isContact: false,
      });
      if (this.state.pro) {
        this.state.pro[0].contact.map((contact) => {
          if (contact.type != "email") {
            this.state.pro[0].contact.pop();
          }
        });
      }
    }
    if (this.state.contactEmail || this.state.contactNo) {
      let contactEmailObj = {};
      let contactNumberObj = {};
      if (this.state.pro[0].contact[0]) {
        contactEmailObj = {
          type: "email",
          info: this.state.contactEmail
            ? this.state.contactEmail
            : this.state.pro[0].contact[0].info,
        };
      }
      if (this.state.pro[0].contact[1] || !this.state.isContact) {
        contactNumberObj = {
          type: "phone",
          info: this.state.contactNo
            ? this.state.contactNo
            : this.state.pro[0].contact[1].info,
        };
      }
      const contactArr = [];
      if (this.state.pro[0].contact[0]) contactArr.push(contactEmailObj);
      if (this.state.pro[0].contact[1] || !this.state.isContact)
        contactArr.push(contactNumberObj);
      const data = {
        firstName: this.state.pro[0].firstName,
        lastName: this.state.pro[0].lastName,
        clientID: this.state.pro[0].clientID,
        organizationID: this.state.pro[0].organizationID,
        organizationName: this.state.pro[0].organizationName,
        contact: contactArr,
        address: this.state.pro[0].address,
        _id: this.state.pro[0]._id,
      };
      const data1 = {
        firstName: this.state.pro[0].firstName,
        lastName: this.state.pro[0].lastName,
        clientID: this.state.pro[0].clientID,
        organizationID: this.state.pro[0].organizationID,
        organizationName: this.state.pro[0].organizationName,
        contact: contactArr,
        address: this.state.pro[0].address,
        __v: this.state.pro[0].__v,
        _id: this.state.pro[0]._id,
      };
      // br.push(data1);
      // console.log("b", br);
      br[0] = data1;
      try {
        const response = await this.props.update(data);
        this.getProfile(br);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // handleEdit = () => {
  //   if (this.state.pro) {
  //     this.state.pro[0].contact.map((isEdit) => {
  //       if (isEdit.type !== "email") {
  //         this.setState({
  //           editContactInfo: true,
  //         });
  //       } else {
  //         this.setState({
  //           editContactInfo: false,
  //         });
  //       }
  findContact = () => {
    if (!this.state.isContact) {
      this.setState({
        isContact: true,
      });
    }
  };

  render() {
    const {
      profile,
      loading,
      dataUrl,
      pending,
      displayCrop,
      pro,
      updatedTime,
    } = this.state;
    const { classes } = this.props;
    if (pro) {
      this.state.pro[0].contact.map((contact) => {
        if (contact.type != "email") {
          this.findContact();
        }
      });
    }
    if (pro) 
      // console.log("...Z", this.state.pro[0]);

    return (
      <div style={{ marginLeft: "65px" }}>
        {displayCrop && (
          <ReactCrop
            {...this.state}
            src={dataUrl}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        <ImageUpload onUpload={this.handleUpload} />
        {displayCrop && (
          <div style={{ textAlign: "center" }}>
            <SaveButton onClick={this.uploadImage} isLoading={pending} />
          </div>
        )}

        {this.state.open && (
          <dialog open onClick={this.handleShowDialog}>
            <img src={dataUrl} onClick={this.handleShowDialog} />
          </dialog>
        )}

        {!displayCrop && (
          <div>
            <DateTimeBar org={true} />
            <div style={{ padding: 100 }}>
              <h2>Profile</h2>
              <div style={{ display: "flex" }}>
                <div style={{ paddingRight: "10vh" }}>
                  <div style={{ width: "100%", display: "grid" }}>
                    {/* <Avatar
                    src={ URL.createObjectURL(this.state.newImage)}
                    onClick={this.handleShowDialog}
                    variant='square'
                    style={{width: '168px', height: '168px'}}
                  /> */}
                    {pro && pro[0] && (
                      <UserAvatar
                        name={
                          pro[0] && `${pro[0].firstName} ${pro[0].lastName}`
                        }
                        size="200px"
                        src={`/api/account/${pro[0].organizationID}/Avatar/${pro[0]._id}?udpatedTime=${updatedTime}`}
                      />
                    )}
                    <IconButton
                      className={classes.photoIcon}
                      onClick={this.handleClickProfile}
                    >
                      <PhotoCamera className={classes.photoCamera} />
                    </IconButton>
                  </div>
                  {pro && pro[0] && pro[0].contact && (
                    <div style={{ textAlign: "left" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "10px",
                            color: "grey",
                            textAlign: "center",
                          }}
                        >
                          PRIMARY CONTACT INFORMATION
                        </span>
                        {!this.state.editContactInfo && (
                          <EditIcon
                            style={{
                              cursor: "pointer",
                              height: "13px",
                            }}
                            onClick={() =>
                              this.setState({ editContactInfo: true })
                            }
                          />
                        )}
                        {this.state.editContactInfo && (
                          <DoneIcon
                            style={{
                              cursor: "pointer",
                              height: "17px",
                            }}
                            onClick={this.updatePrimaryInfo}
                          />
                        )}
                      </div>
                      {pro[0].contact.map((contact) => (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {contact.type === "email" && (
                            <MailIcon
                              color="disabled"
                              style={{
                                margin: "3px",
                                marginRight: "9px",
                                height: ".8em",
                              }}
                            />
                          )}
                          {contact.type != "email" && (
                            <CallIcon
                              color="disabled"
                              style={{
                                margin: "3px",
                                marginRight: "9px",
                                height: ".8em",
                              }}
                            />
                          )}
                          {this.state.editContactInfo &&
                          contact.type != "email" ? (
                            <Input
                              type="tel"
                              defaultValue={contact.info}
                              value={
                                contact.type === "email"
                                  ? this.state.contactEmail
                                  : this.state.contactNo
                              }
                              onChange={
                                contact.type === "email"
                                  ? this.handleMailId
                                  : this.handleContactNo
                              }
                            />
                          ) : (
                            <p style={{ fontSize: "12px", color: "#303133" }}>
                              {contact.info}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {!this.state.isContact && this.state.editContactInfo && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CallIcon
                        color="disabled"
                        style={{
                          margin: "3px",
                          marginRight: "9px",
                          height: ".8em",
                        }}
                      />
                      <Input
                        type="number"
                        defaultValue=""
                        value={this.state.contactNo}
                        onChange={this.handleContactNo}
                      />
                    </div>
                  )}
                </div>
                {this.props.profiles[0] && (
                  <div>
                    <ContactInformation
                      onChange={this.handleProfileChange}
                      getProfile={this.getProfile}
                      profiles={this.props.profiles}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("....",state.profile)
  return {
    profiles: state.profiles,
    users: state.users,
    meetings: state.meetings.list,
    organizations: state.organizations,
  };
};

const mapDispatchToProps = (dispatch) => ({
  update: (user) => dispatch(editUser(user)),
  create: (orgId, file) => dispatch(createAvatar(orgId, file)),
});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationHOC(Profile))
);
