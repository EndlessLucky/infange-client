import React from "react";
import "./style.css";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  flex: {
    display: "flex",
    alignItems: "center",
    alignContent: "center",
    flexGrow: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#e3e5e6",
    height: "45px",
  },
});

const Flex = ({ className, classes, children, props }) => {
  const c = `${classes.flex} ${className ? className : ""}`;
  return (
    <div className={c} {...props}>
      {children}
    </div>
  );
};

export default withStyles(styles)(Flex);
