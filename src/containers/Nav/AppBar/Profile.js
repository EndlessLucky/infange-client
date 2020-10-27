//
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { MenuItem } from "@material-ui/core";
import Storage from "../../../helpers/storage";
import { AccountCircle, Notifications } from "@material-ui/icons";
import { MenuButton, IconButton } from "../../../components/controls/Button";
import SearchBar from "./SearchBar";
import Results from "./Results";
import AddIcon from "./AddIcon";
import { UserAvatar } from "../../Avatar";
import { AccountHOC } from "../../../context/AccountProvider";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import {
  getNotifications,
  readNotification,
  deleteNotification,
} from "../../../actions/notification";
import { connect } from "react-redux";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import { unregister } from "../../../registerServiceWorker";
import moment from "moment";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

let trashStarted;
const StyledMenu = withStyles({
  paper: {
    width: "400px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

class Profile extends Component {
  state = {
    anchorEl: null,
    trashOpen: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.account !== this.props.account) {
      this.getNotifications();
    }
  }
  componentWillUnmount() {
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
  }

  handleLogout = () => {
    Storage.logout();

    unregister();
    this.props.history.push("/Login");
  };

  handleProfile = () => {
    this.props.history.push(`/Profile`);
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getNotifications = () => {
    if (this.props.account && this.props.account.length) {
      const userId = this.props.account[0]._id;
      this.props.getNotifications(userId);
    }
  };

  handleChange = () => {
    this.props.history.push("/Change");
  };
  toggleTrashOpen = () => {
    this.setState({ trashOpen: !this.state.trashOpen });
  };

  trashedNotificationStart = () => {
    trashStarted = true;
    return (
      // <div style={{ padding: "10px" }}>
      //   Deleted Notifications:
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#ffbfbf",
        }}
      >
        <div style={{ padding: "10px" }}>Deleted Notifications:</div>
        <div
          style={{ cursor: "pointer", marginRight: "25px" }}
          onClick={() => this.toggleTrashOpen()}
        >
          {this.state.trashOpen ? (
            <div>
              Hide
              <ArrowDropUpIcon />
            </div>
          ) : (
            <div>
              Show
              <ArrowDropDownIcon />
            </div>
          )}
        </div>
      </div>
    );
  };

  render() {
    const account = this.props.account.length && this.props.account[0];
    const {
      notifications,
      markReadNotification,
      removeNotification,
    } = this.props;
    const unreadCount =
      notifications && notifications.length
        ? notifications.filter((n) => !n.read).length
        : 0;
    trashStarted = false;
    return (
      <Fragment>
        <SearchBar />
        <Results />

        <div>
          <AddIcon />

          <IconButton color="inherit" onClick={this.handleClick}>
            <Badge badgeContent={unreadCount} color="secondary">
              <Notifications style={{ color: "grey" }} />
            </Badge>
          </IconButton>
          {account && (
            <MenuButton
              id="menu-appbar"
              icon={
                <UserAvatar
                  userID={account._id}
                  organizationID={account.organizationID}
                  updatedAt={this.props.updatedAt}
                  disableInteractive={true}
                />
              }
            >
              <MenuItem key="Profile" onClick={this.handleProfile}>
                Profile
              </MenuItem>
              <MenuItem disabled key="My Account">
                My account
              </MenuItem>
              <MenuItem
                key="change"
                onClick={() => this.props.history.push("/Change")}
              >
                Reset Credentials
              </MenuItem>
              <MenuItem key="logout" onClick={this.handleLogout}>
                Logout
              </MenuItem>
            </MenuButton>
          )}

          <StyledMenu
            id="customized-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
          >
            {notifications && notifications.length === 0 && (
              <Alert color={"Grey"}>No Notifications </Alert>
            )}
            {notifications &&
              notifications.length > 0 &&
              notifications.map((notification) => {
                return (
                  <div>
                    {notification.trash &&
                      !trashStarted &&
                      this.trashedNotificationStart()}
                    {(this.state.trashOpen || !notification.trash) && (
                      <div style={{ paddingRight: 20 }}>
                        <Alert
                          color={
                            notification.trash
                              ? "warning"
                              : notification.read
                              ? "success"
                              : "info"
                          }
                          onClick={(e) => {
                            if (
                              e.target.tagName !== "svg" &&
                              e.target.tagName !== "path"
                            ) {
                              markReadNotification(notification);
                              if (notification.payload.title === "Objective") {
                                this.props.history.push({
                                  pathname: "/objectives",
                                  search: "",
                                  state: {
                                    selectedObj: notification.payload.id,
                                  },
                                });
                              }
                              if (notification.payload.title === "Meeting") {
                                this.props.history.push({
                                  pathname: `/Meetings`,
                                  search: "",
                                  state: {
                                    selectedMtng: notification.payload.id,
                                  },
                                });
                              }
                              this.handleClose();
                            }
                          }}
                          onClose={(e) => {
                            e.preventDefault();
                            removeNotification(notification);
                          }}
                          action={notification.trash ? <div></div> : null}
                        >
                          <p
                            style={{
                              maxWidth: "275px",
                              wordWrap: "break-word",
                            }}
                          >
                            {notification.payload.message}
                          </p>
                          <p style={{ margin: "5px" }}>
                            {moment
                              .utc(notification.createDate)
                              .local()
                              .format("MM/DD/YYYY hh:mm a")}
                          </p>
                        </Alert>
                      </div>
                    )}
                  </div>
                );
              })}
          </StyledMenu>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { notifications: state.notifications };
};

const mapDispatchToProps = (dispatch) => ({
  getNotifications: (userId) => dispatch(getNotifications(userId)),
  markReadNotification: (notification) =>
    dispatch(readNotification(notification)),
  removeNotification: (notification) =>
    dispatch(deleteNotification(notification)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountHOC(Profile)));
