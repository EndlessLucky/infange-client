import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Sidebar from "./Sidebar";
import Menu from "@material-ui/core/Menu";
import BusinessIcon from "@material-ui/icons/Business";
import NoteIcon from "@material-ui/icons/NoteAdd";
import PeopleIcon from "@material-ui/icons/People";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import DocumentIcon from "@material-ui/icons/InsertDriveFile";
import MenuItem, { MenuItemIcon } from "./MenuItem";
import Notification from "./Notification";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

const drawerWidth = 240;
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: "white"
    // [theme.breakpoints.up('md')]: {
    //     display: 'none',
    // },
  },
  appBar: {
    position: "fixed",
    marginLeft: drawerWidth,
    zIndex: theme.zIndex.toolbar + 1
    // [theme.breakpoints.up('md')]: {
    //     width: `calc(100% - ${drawerWidth}px)`,
    // },
  },

  menuRight: {}
});

class ButtonAppBar extends Component {
  state = {
    sideBarOpen: false,
    anchorEl: null
  };
  handleSideBar = () => {
    this.setState({ sideBarOpen: !this.state.sideBarOpen });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  pushRoute = () => { };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              onClick={this.handleSideBar}
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer Menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              onClick={() => alert("hello")}
              variant="h6"
              color="inherit"
              className={classes.flex}
            >
              Infange
            </Typography>
            <div>
              {/* <Notification /> */}
              <IconButton
                aria-owns={open ? "menu-appbar" : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right"
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleClose}>My account</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Sidebar open={this.state.sideBarOpen} onMenuClose={this.handleSideBar}>
          {/*<MenuItem button component={Link} to="/Organizations" primary="Organizations">*/}
          {/*<MenuItemIcon><BusinessIcon/></MenuItemIcon>*/}
          {/*</MenuItem>*/}
          <MenuItem button component={Link} to="/Meeting" primary="Meeting">
            {/*<MenuItemIcon><DocumentIcon/></MenuItemIcon>*/}
          </MenuItem>
          <MenuItem
            button
            onClick={this.handleSideBar}
            component={Link}
            to="/5b22c1a3859e294b7c1a4d13/Objectives"
            primary="Objectives"
          >
            {/*<MenuItemIcon><PeopleIcon/></MenuItemIcon>*/}
          </MenuItem>
          <MenuItem button component={Link} to="/Notes" primary="Notes">
            {/*<MenuItemIcon><NoteIcon/></MenuItemIcon>*/}
          </MenuItem>
          <MenuItem
            button
            component={Link}
            to="/Performance"
            primary="Performance"
          >
            {/*<MenuItemIcon><PeopleIcon/></MenuItemIcon>*/}
          </MenuItem>
        </Sidebar>
      </div>
    );
  }
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(ButtonAppBar));