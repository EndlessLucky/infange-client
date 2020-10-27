import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter } from "react-router-dom";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import Divider from "@material-ui/core/Divider";
import { MenuItem } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import Loading from "../../../components/controls/Loading";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  popper: {
    width: "100%",
  },
  paper: {
    width: "68%",
    overflowY: "scroll",
    maxHeight: "300px",
    marginTop: "50px",
    marginLeft: "15vw",
  },
  progress: {
    margin: theme.spacing(2),
    position: "relative",
    top: "50%",
    left: "50%",
  },
  searchResults: {
    display: "flex",
    outline: "none",
  },
  listItemText: {
    width: "20%",
    minWidth: 100,
    paddingTop: "5px",
  },
  text: {
    paddingTop: "5px",
    paddingBottom: "5px",
  },
});

class Results extends Component {
  constructor(props) {
    super(props);
    this.anchorEl = React.createRef();
    this.filterEl = React.createRef();
  }

  handleNavigateClick = (id, source) => () => {
    const { history } = this.props;
    if (source == "Meetings") history.push(`/${source}/${id}`);
    else if (source == "Objectives")
      history.push({
        pathname: "/Objectives",
        search: "",
        state: { selectedObj: id },
      });
    else if (source == "Notes")
      history.push({
        pathname: "/Notes",
        search: "",
        state: { selectedNote: id },
      });

    this.props.close();
  };

  render() {
    const { results, open, classes, loading = false } = this.props;

    return (
      <div>
        <Popper
          className={classes.popper}
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          placement={"bottom-start"}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.paper}>
                {loading ? (
                  <div style={{ position: "relative" }}>
                    <Loading className={classes.progress} />
                  </div>
                ) : results.length > 0 ? (
                  results.map(
                    (x, i) => (
                      <MenuItem
                        key={x._id + x.source}
                        onClick={this.handleNavigateClick(x._id, x.source)}
                      >
                        <MenuList>
                          <div className={classes.searchResults}>
                            {x.source == "Meetings" && (
                              <ListItemText
                                className={classes.listItemText}
                                style={{ width: "400px" }}
                                primary={
                                  x.title && x.title.length > 40
                                    ? `${x.title.substring(0, 40)} ...`
                                    : x.title
                                }
                              />
                            )}
                            {x.source == "Objectives" && (
                              <ListItemText
                                className={classes.listItemText}
                                style={{ width: "400px" }}
                                primary={
                                  x.description && x.description.length > 40
                                    ? `${x.description.substring(0, 40)} ...`
                                    : x.description
                                }
                              />
                            )}
                            <ListItemText
                              className={classes.listItemText}
                              primary={moment(x.createDate).format(
                                "MM/DD/YYYY"
                              )}
                            />
                            <ListItemText
                              className={classes.listItemText}
                              primary={x.source}
                            />
                          </div>
                          <div className={classes.searchResults}>
                            {x.source == "Notes" && (
                              <ListItemText
                                className={classes.text}
                                secondary={
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: `<style> #notes img{ width: 100%}</style> <div id="notes">${
                                        x.text && x.text.length > 40
                                          ? `${x.text.substring(0, 40)} ...`
                                          : x.text
                                      }</div>`,
                                    }}
                                    style={{ flex: 10 }}
                                  />
                                }
                              />
                            )}
                          </div>
                        </MenuList>
                      </MenuItem>
                    ),
                    <Divider />
                  )
                ) : (
                  <p style={{ textAlign: "center" }}>No Results found</p>
                )}
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.globalSearch };
};

const mapDispatchToProps = (dispatch) => ({
  close: () => dispatch({ type: "CLOSE_GLOBAL_RESULTS" }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Results)));
