import React, { Component } from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";

const drawerWidth = 240;
const styles = theme => ({
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250
    // [theme.breakpoints.up('md')]: {
    //     width: drawerWidth,
    //     position: 'fixed',
    //     height: '100%'
    // },
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    // padding: theme.spacing(3),
    height: "calc(100% - 56px)",
    marginTop: 56
    // [theme.breakpoints.up('md')]: {
    //     height: 'calc(100% - 64px)',
    //     width: `calc(100% - ${drawerWidth}px)`,
    //     marginTop: 64,
    //     marginLeft: drawerWidth,
    // },
  },
  menuButton: {
    marginRight: theme.spacing(1) * 4
  },
  toolbar: theme.mixins.toolbar
});

class MyToolbar extends Component {
  render() {
    const { children, theme, classes, onMenuClose } = this.props;
    return (
      <Toolbar>
        {/*<Hidden mdUp>*/}
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={this.props.open}
          classes={{
            paper: classes.drawerPaper
          }}
          onClose={onMenuClose}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
        >
          <div className={classes.toolbar} />
          {children}
        </Drawer>
        {/*</Hidden>*/}
        {/*<Hidden smDown implementation="css">*/}
        {/*<Drawer*/}
        {/*variant="permanent"*/}
        {/*open*/}
        {/*classes={{*/}
        {/*paper: classes.drawerPaper,*/}
        {/*}}*/}
        {/*>*/}
        {/*<div className={classes.toolbar} />*/}
        {/*{children}*/}
        {/*</Drawer>*/}
        {/*</Hidden>*/}
      </Toolbar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MyToolbar);
