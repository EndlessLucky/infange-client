import React from "react";
import BaseButton from "./Base";
import Cancel from "@material-ui/icons/Cancel";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import red from "@material-ui/core/colors/red";

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    background: red[700],
    "&:hover": {
      background: red[900]
    },
    color: "#fff"
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  }
});

const CancelButton = ({ children, classes, ...props }) => {
  return (
    <BaseButton variant="contained" className={classes.button} {...props}>
      <Cancel className={classNames(classes.leftIcon, classes.iconSmall)} />{" "}
      Cancel
    </BaseButton>
  );
};

export default withStyles(styles)(CancelButton);
