import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { MenuItem } from "@material-ui/core";
import { AccountCircle, Notifications, Add } from "@material-ui/icons";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import Menu from "@material-ui/core/Menu";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { MenuButton, IconButton } from "../../components/controls/Button";
import Modal from "../../components/controls/Modal";
import Search from "../../components/controls/Search";
import AddMeeting from "../Meeting/Create";
import AddObjective from "../Objective/Create";
import AddNote from "../Note/Create";
import Loading from "../../components/controls/Loading";
import { InputAdornment } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import CheckBox from "../../components/controls/CheckBox";

import Storage from "../../helpers/storage";
import { withStyles } from "@material-ui/core/styles";

const queryString = `/api/account/search`;
const CancelToken = axios.CancelToken;
let cancel;

const styles = theme => ({
  popper: {
    width: "100%"
  },
  searchBox: {
    display: "flex",
    flex: 1,
    position: "relative",
    marginRight: 50
  },
  paper: {
    width: "100%",
    overflowY: "scroll",
    maxHeight: "300px"
  },
  searchResults: {
    display: "flex",
    outline: "none"
  },
  listItemText: {
    width: "20%",
    minWidth: 100,
    paddingTop: "5px"
  },
  text: {
    paddingTop: "5px",
    paddingBottom: "5px"
  },
  progress: {
    margin: theme.spacing(2),
    position: "relative",
    top: "50%",
    left: "50%"
  }
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingIsOpen: false,
      objectiveIsOpen: false,
      noteIsOpen: false,
      results: [],
      value: "",
      anchorLangMenu: null,
      filters: {
        meetings: true,
        objectives: true,
        notes: true,
        users: true
      },
      open: false
    };
    this.anchorEl = React.createRef();
    this.filterEl = React.createRef();
  }

  handleClick = event => {
    this.setState({
      anchorLangMenu: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorLangMenu: null
    });
  };

  handleChange = e => {
    let v = e.target.value;
    this.setState({ value: v });
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
    this.pauseTimeout = setTimeout(() => {
      if (v.length >= 3) {
        this.performSearch(v);
      }
    }, 800);
  };

  componentWillUnmount() {
    if (this.pauseTimeout) {
      clearTimeout(this.pauseTimeout);
    }
  }

  performSearch = async v => {
    if (v !== "") {
      if (cancel) {
        cancel("I cancelled it");
      }
      try {
        const {
          filters: { objectives, notes, meetings, users }
        } = this.state;
        this.setState({ loading: true });
        let results = await axios.get(`${queryString}`, {
          params: {
            search: v,
            objectives,
            notes,
            meetings,
            users
          },
          cancelToken: new CancelToken(c => (cancel = c))
        });
        this.setState({ loading: false, results: results.data });
      } catch (err) {
        if (!err) {
          // this was a cancellation
        } else {
          console.warn(err.data);
          this.setState({ loading: true });
        }
      }
    }
  };

  handleLogout = () => {
    Storage.logout();
    this.props.history.push("/Login");
  };

  handleProfile = () => {
    this.props.history.push(`/Profile`);
  };

  handleNewMeeting = () => {
    this.setState({ meetingIsOpen: true });
  };

  handleCloseMeeting = () => {
    this.setState({ meetingIsOpen: false });
  };

  handleNewObjective = () => {
    this.setState({ objectiveIsOpen: true });
  };

  handleCloseObjective = () => {
    this.setState({ objectiveIsOpen: false });
  };

  handleNewNote = () => {
    this.setState({ noteIsOpen: true });
  };

  handleCloseNote = () => {
    this.setState({ noteIsOpen: false });
  };

  handleNavigateClick = (id, source) => () => {
    const { history } = this.props;
    history.push(`/${source}/Edit/${id}`);
  };

  handleFilterChange = event => {
    let n = event.target.name;
    let c = event.target.checked;
    this.setState(s => {
      s.filters[n] = c;
      return s;
    });
  };

  render() {
    const { open, results, loading, filters } = this.state;
    const { classes } = this.props;

    return (
      <Fragment>
        <div className={classes.searchBox} ref={r => (this.anchorEl = r)}>
          <Search
            onChange={this.handleChange}
            onFocus={() => this.setState({ open: true })}
            onBlur={() => this.setState({ open: false })}
            endAdornment={
              <InputAdornment position="end" style={{ color: "inherit" }}>
                <IconButton
                  onClick={this.handleClick}
                  style={{ color: "white" }}
                >
                  <FilterListIcon />
                  <span ref={r => (this.filterRef = r)} />
                </IconButton>
                <Menu
                  open={Boolean(this.state.anchorLangMenu)}
                  onClose={this.handleClose}
                  anchorEl={this.filterRef}
                >
                  <MenuItem key="Meetings">
                    <CheckBox
                      name="meetings"
                      checked={filters.meetings}
                      onChange={this.handleFilterChange}
                    />{" "}
                    Meetings
                  </MenuItem>
                  <MenuItem key="Objectives">
                    <CheckBox
                      name="objectives"
                      checked={filters.objectives}
                      onChange={this.handleFilterChange}
                    />{" "}
                    Objectives
                  </MenuItem>
                  <MenuItem key="Notes">
                    <CheckBox
                      name="notes"
                      checked={filters.notes}
                      onChange={this.handleFilterChange}
                    />{" "}
                    Notes
                  </MenuItem>
                  <MenuItem key="Users">
                    <CheckBox
                      name="users"
                      checked={filters.users}
                      onChange={this.handleFilterChange}
                    />{" "}
                    Users
                  </MenuItem>
                </Menu>
              </InputAdornment>
            }
          ></Search>

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
                  ) : (
                    results.map(
                      (x, i) => (
                        <MenuItem
                          key={x._id + x.source}
                          onClick={this.handleNavigateClick(x._id, x.source)}
                        >
                          <MenuList>
                            <div className={classes.searchResults}>
                              <ListItemText
                                className={classes.listItemText}
                                primary={x.title}
                              />
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
                              <ListItemText
                                className={classes.text}
                                secondary={x.text}
                              />
                            </div>
                          </MenuList>
                        </MenuItem>
                      ),
                      <Divider />
                    )
                  )}
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        <div>
          <MenuButton id="menu-appbar" icon={<Add />}>
            <MenuItem key="Meeting" onClick={this.handleNewMeeting}>
              {" "}
              Meeting{" "}
            </MenuItem>
            <MenuItem key="Objective" onClick={this.handleNewObjective}>
              {" "}
              Objective{" "}
            </MenuItem>
            <MenuItem key="Note" onClick={this.handleNewNote}>
              {" "}
              Note{" "}
            </MenuItem>
          </MenuButton>

          <IconButton color="inherit">
            <Notifications />
          </IconButton>

          <MenuButton id="menu-appbar" icon={<AccountCircle />}>
            <MenuItem key="Profile" onClick={this.handleProfile}>
              Profile
            </MenuItem>
            <MenuItem disabled key="My Account">
              My account
            </MenuItem>
            <MenuItem key="logout" onClick={this.handleLogout}>
              Logout
            </MenuItem>
          </MenuButton>

          <Modal
            open={this.state.meetingIsOpen}
            onClose={this.handleCloseMeeting}
            title="Add Meeting"
          >
            {" "}
            <AddMeeting onComplete={this.handleCloseMeeting} />{" "}
          </Modal>
          <Modal
            open={this.state.objectiveIsOpen}
            onClose={this.handleCloseObjective}
            title="Add Objective"
          >
            {" "}
            <AddObjective onComplete={this.handleCloseObjective} />{" "}
          </Modal>
          <Modal
            open={this.state.noteIsOpen}
            onClose={this.handleCloseNote}
            title="Add Note"
          >
            {" "}
            <AddNote />{" "}
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Profile));
