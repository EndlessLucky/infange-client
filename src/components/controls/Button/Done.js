import React from "react";
import BaseButton from "./Base";
import Done from "@material-ui/icons/Done";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
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

const DoneButton = ({ children, classes, ...props }) => {
  return (
    <BaseButton variant="contained" className={classes.button} {...props}>
      <Done className={classNames(classes.leftIcon, classes.iconSmall)} /> Done
    </BaseButton>
  );
};

export default withStyles(styles)(DoneButton);
