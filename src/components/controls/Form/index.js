import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  flex: {
    display: "flex",
    margin: theme.spacing(1) * 3,
    maxWidth: 800,
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: "20px",
    flex: "0 0 49%",
    justifyContent: "space-between"
  }
});

const cancelEnter = e => {
  e.preventDefault();
  return false;
};

const Form = ({ children, classes, ...props }) => (
  <form onSubmit={cancelEnter} className={classes.flex} {...props}>
    {children}
  </form>
);

export default withStyles(styles)(Form);
