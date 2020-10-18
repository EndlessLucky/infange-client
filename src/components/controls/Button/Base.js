import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from 'clsx';

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
    position: "relative"
  },
  progress: {
    color: "primary",
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  },

  loadingWrapper: {
    zIndex: 2,
    background: "rgba(255,255,255,0.4)",
    width: "100%",
    height: "100%",
    position: "absolute"
  }
});

const MyButton = ({
  classes,
  children,
  isLoading = false,
  disabled,
    className,
  ...props
}) => {
  return (
    <Button
      className={clsx(classes.button, className)}
      variant="contained"
      {...props}
      disabled={isLoading || disabled}
    >
      {children}
      {isLoading ? (
        <div className={classes.loadingWrapper}>
          <CircularProgress
            className={classes.progress}
            size={20}
            style={{
              margin: `-${20 / 2}px 0 0 -${20 / 2}px`
            }}
          />
        </div>
      ) : null}
    </Button>
  );
};

export default withStyles(styles)(MyButton);
