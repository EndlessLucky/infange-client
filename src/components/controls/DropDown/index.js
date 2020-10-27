import React from "react";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { withStyles } from "@material-ui/core/styles";
import MultiSelect from "./Multiselect";

const styles = theme => ({
  dropDown: {
    margin: theme.spacing(1),
    flex: "0 0 95%",
    [theme.breakpoints.up("md")]: {
      flex: "0 0 45%"
    }
  }
});

const DropDown = ({ classes, label, name, id, value = "", ...props }) => (
  <FormControl className={classes.dropDown}>
    <InputLabel htmlFor={id}>{label}</InputLabel>
    <Select value={value} {...props} onChange={(e) => props.onChange(e, e.target.value)} inputProps={{ name: name, id: id }} />
  </FormControl>
);

export { MultiSelect };
export default withStyles(styles)(DropDown);
