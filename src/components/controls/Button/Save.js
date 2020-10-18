import React from "react";
import BaseButton from "./Base";
import Save from "@material-ui/icons/Save";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  },
  wrapper: {
    paddingTop: theme.spacing(1)
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

const SaveButton = ({ children, classes, ...props }) => {
  return (
    <div className={classes.wrapper}>
      <BaseButton variant="contained" color="primary" {...props}>
        <Save className={clsx(classes.leftIcon, classes.iconSmall)} /> Save
      </BaseButton>
    </div>
  );
};

export default withStyles(styles)(SaveButton);
