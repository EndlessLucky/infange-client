import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Toolbar, Drawer, MenuItem } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 180,
    color: "#000",
    background: "#fff",
    display: "flex",
    paddingLeft: "30px",
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    height: "calc(100% - 56px)",
    marginTop: 56,
  },
  menuButton: {
    marginRight: theme.spacing(4),
  },
  toolbar: theme.mixins.toolbar,
});

const RouteLink = ({ activeID, url, primary, ...props }) => (
  <MenuItem
    button
    {...props}
    component={Link}
    to={`${activeID ? `/${activeID}` : ""}/${url}`}
  >
    {primary}
  </MenuItem>
);

const RouteLinks = ({ activeID, ...props }) => [
  <RouteLink
    activeID={activeID}
    key="Dashboard"
    url="Dashboard"
    primary="Dashboard"
    {...props}
  />,
  <RouteLink
    activeID={activeID}
    key="Meetings"
    url="Meetings"
    primary="Meetings"
    {...props}
  />,
  <RouteLink
    activeID={activeID}
    key="Objectives"
    url="Objectives"
    primary="Objectives"
    {...props}
  />,
  <RouteLink
    activeID={activeID}
    key="Notes"
    url="Notes"
    primary="Notes"
    {...props}
  />,
];

class Sidebar extends Component {
  render() {
    const { theme, classes, onMenuClose, activeID } = this.props;
    return (
      <Toolbar>
        {/*<Hidden mdUp>*/}
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={this.props.open}
          classes={{
            paper: classes.drawerPaper,
          }}
          onClose={onMenuClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div className={classes.toolbar} />
          <div style={{ marginTop: 30 }}>
            <RouteLinks activeID={activeID} onClick={onMenuClose} />
          </div>
        </Drawer>
      </Toolbar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Sidebar);
