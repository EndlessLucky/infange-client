import React from "react";
import BaseButton from "./Base";
import Send from "@material-ui/icons/Send";
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

const SaveButton = ({ children, classes, ...props }) => {
  return (
    <BaseButton variant="contained" color="secondary" {...props}>
      Send <Send className={classNames(classes.rightIcon, classes.iconSmall)} />
    </BaseButton>
  );
};

export default withStyles(styles)(SaveButton);
