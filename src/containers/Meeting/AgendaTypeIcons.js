import React from "react";
import ListIcon from "@material-ui/icons/List";
import QuestionIcon from "@material-ui/icons/Help";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ObjectiveIcon from "@material-ui/icons/AssignmentTurnedIn";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  question: {
    color: "#FFC0CB"
  },
  objective: {
    color: "#32CD32"
  }
}));

const MenuIcon = ({ type }) => {
  const classes = useStyles();
  if (type === "Topic") {
    return <ListIcon color="primary" />;
  } else if (type === "Question") {
    return <QuestionIcon className={classes.question} />;
  } else if (type === "Objective") {
    return <ObjectiveIcon className={classes.objective} />;
  } else return <MoreVertIcon />;
};

export default MenuIcon;
