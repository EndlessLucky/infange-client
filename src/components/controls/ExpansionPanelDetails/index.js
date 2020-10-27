import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";

const styles = (theme) => ({
  expansionpanel: {
    wordSpacing: "200px",
    width: "max-content",
    textAlign: "center",
    overflow: "hidden",
  },
});

const Expansion = ({ size = 20, classes, children, ...props }) => {
  return (
    <div>
      <div className={classes.expansionpanel}>
        <ExpansionPanelDetails />
      </div>
      {children}
    </div>
  );
};

export default withStyles(styles)(Expansion);
