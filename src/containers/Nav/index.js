import React, { Component } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { withStyles, rgbToHex } from "@material-ui/core/styles";
import { Menu as MenuIcon } from "@material-ui/icons";
import { IconButton } from "../../components/controls/Button";
import mobLogo from "../../orange-bubble.png";
import Sidebar from "./Sidebar";
import { Title } from "../../components/controls/Typography";
import urlMapper from "../../helpers/url";
import ProfileOptions from "./AppBar/Profile";
import clsx from "clsx";
import logoImage from "../../logo.png";
import { Link } from "react-router-dom";
import "../../index.css";

const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: "0 50px",
    marginRight: "20px",
  },
  appBar: {
    position: "fixed",
    marginLeft: drawerWidth,
    backgroundColor: "#fff",
  },
  title: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
});

class Nav extends Component {
  state = {
    sideBarOpen: false,
    updatedAt: this.props.updatedAt,
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.updatedAt != this.props.updatedAt)
      this.setState({ updatedAt: this.props.updatedAt });
  };

  handleSideBar = () => {
    this.setState({ sideBarOpen: !this.state.sideBarOpen });
  };
  render() {
    const {
      classes,
      match: { url },
    } = this.props;
    return (
      <div>
        <div className={classes.root}>
          <AppBar className={classes.appBar}>
            <Toolbar disableGutters>
              {/* <div style={{ marginRight: "15px" }}> */}
              <IconButton
                onClick={this.handleSideBar}
                className={classes.menuButton}
                color="inherit"
                aria-label="open drawer Menu"
              >
                <MenuIcon style={{ color: "#000" }} />
              </IconButton>
              <div style={{ marginRight: "15px" }}>
                <Link className="logo_big" to="/Dashboard">
                  <img
                    src={logoImage}
                    alt="logo"
                    // height="35px"
                    width={
                      window.innerWidth <= 460
                        ? window.innerWidth <= 380
                          ? "60px"
                          : "100px"
                        : "200px"
                    }
                  />
                </Link>
                <Link className="logo_small" to="/Dashboard">
                  <img src={mobLogo} alt="logo" height="35px" />
                </Link>
              </div>
              <ProfileOptions updatedAt={this.state.updatedAt} />
            </Toolbar>
          </AppBar>
          <Sidebar
            open={this.state.sideBarOpen}
            onMenuClose={this.handleSideBar}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Nav);
