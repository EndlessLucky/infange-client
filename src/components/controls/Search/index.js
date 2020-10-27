import React, { Fragment, PureComponent } from "react";
import { InputAdornment, FormControl } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  searchBar: {
    position: "relative",
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.15),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
      textColor: "white",
    },
  },
  checkBox: {
    marginRight: "5px",
  },
});

class Search extends PureComponent {
  state = {
    checkUsers: true,
    checkMeetings: true,
    checkObjectives: true,
    checkNotes: true,
  };

  handleCheckChange = (name) => (event) => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    const {
      classes,
      textColor = "inherit",
      open,
      style,
      ...props
    } = this.props;
    return (
      <Fragment>
        <FormControl style={{ width: "100%" }}>
          <Input
            startAdornment={
              <InputAdornment
                position="start"
                style={{ color: textColor, marginLeft: "10px" }}
              >
                <SearchIcon />
              </InputAdornment>
            }
            placeholder="Search..."
            className={classes.searchBar}
            style={{ ...{ color: textColor }, ...style }}
            {...props}
          />
        </FormControl>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Search);
