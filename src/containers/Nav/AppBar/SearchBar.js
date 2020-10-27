import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { MenuItem } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import { InputAdornment } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { IconButton } from "../../../components/controls/Button";
import Search from "../../../components/controls/Search";
import CheckBox from "../../../components/controls/CheckBox";
import { withStyles } from "@material-ui/core/styles";

const CancelToken = axios.CancelToken;
let cancel;

const queryString = `/api/account/search`;

const styles = (theme) => ({
  searchBox: {
    display: "flex",
    flex: 1,
    position: "relative",
    backgroundColor: "#e1e2e3",
    color: "#000",
  },
});

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      results: [],
      anchorLangMenu: null,
      filters: {
        meetings: true,
        objectives: true,
        notes: true,
        users: true,
      },
      open: false,
    };
    this.anchorEl = React.createRef();
    this.filterEl = React.createRef();
  }

  handleNavigateClick = (id, source) => () => {
    const { history } = this.props;
    history.push(`/${source}/Edit/${id}`);
  };

  handleChange = (e) => {
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

  performSearch = async (v) => {
    if (v !== "") {
      if (cancel) {
        cancel("I cancelled it");
      }
      try {
        const {
          filters: { objectives, notes, meetings, users },
        } = this.state;
        this.setState({ loading: true });
        let res = await axios.get(`${queryString}`, {
          params: {
            search: v,
            objectives,
            notes,
            meetings,
            users,
          },
          cancelToken: new CancelToken((c) => (cancel = c)),
        });
        this.setState({ loading: false });
        this.props.updateResults(res.data);
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

  handleClick = (event) => {
    this.setState({
      anchorLangMenu: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorLangMenu: null,
    });
  };

  handleFilterChange = (event) => {
    let n = event.target.name;
    let c = event.target.checked;
    this.setState(
      (s) => {
        s.filters[n] = c;
        return s;
      },
      () => this.performSearch(this.state.value)
    );
  };

  handleBlur = () => {
    this.props.close();
  };

  render() {
    const { filters } = this.state;
    const { classes } = this.props;

    return (
      <div
        className={classes.searchBox}
        style={{ width: window.innerWidth <= 380 ? "40px" : "" }}
        ref={(r) => (this.anchorEl = r)}
      >
        <Search
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          endAdornment={
            <InputAdornment position="end" style={{ color: "inherit" }}>
              <IconButton onClick={this.handleClick} style={{ color: "grey" }}>
                {window.innerWidth >= 380 && <FilterListIcon />}
                <span ref={(r) => (this.filterRef = r)} />
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
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateResults: (r) =>
    dispatch({ type: "RECEIVE_GLOBAL_RESULTS", payload: r }),
  close: () => dispatch({ type: "CLOSE_GLOBAL_RESULTS" }),
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(withRouter(SearchBar)));
