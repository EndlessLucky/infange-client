import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  button: {
    margin: theme.spacing(1)
  }
});

const MyButton = props => <Button {...props} />;

export default withStyles(styles)(MyButton);
