import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import { Toolbar } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import { IconButton } from "../../components/controls/Button";
import ShareSharpIcon from "@material-ui/icons/ShareSharp";

const styles = (theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    color: "white",
  },
  dTitle: {
    padding: "0 0 0 20px",
  },
});

const Transition = React.forwardRef((props, r) => (
  <Slide direction="up" {...props} ref={r} />
));

const sharedModal = ({ children, classes, title, onClose, ...props }) => {
  return (
    <Dialog fullScreen TransitionComponent={Transition} {...props}>
      <AppBar className={classes.appBar}>
        <Toolbar style={{ display: "flex", width: "89%" }}>
          <div
            style={{ width: "90%", display: "flex", justifyContent: "center" }}
          >
            <DialogTitle className={classes.dTitle} style={{ float: "center" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ShareSharpIcon />
                <span className={classes.title}>{title}</span>
              </div>
            </DialogTitle>
          </div>
          <IconButton onClick={onClose} className={classes.title}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {children}
    </Dialog>
  );
};

export default withStyles(styles)(sharedModal);
