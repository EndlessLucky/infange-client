import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Date, Time } from "../../components/Date";
import Fields from "../../components/DoNow";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Flex from "../../components/controls/Flex";
import { getNotifications } from "../../actions/notification";
import { AccountHOC } from "../../context/AccountProvider";
import { connect } from "react-redux";
import DateTimeBar from "../../containers/dashboard/DateTimeBar";
import ToDo from "../../containers/dashboard/ToDo";
import RecentNotes from "../../containers/dashboard/RecentNotes";
import UpcomingMeeting from "../../containers/dashboard/UpcomingMeetings";
import { Grid } from "@material-ui/core";
import "../../common.css";

const axios = require("axios").default;

const styles = (theme) => ({
  inlineFlex: {
    flexWrap: "wrap",
    // justifyContent: "space-between",
    padding: "0 20px",
  },
  summary: {
    display: "inline-block",
  },
  dashboard: {
    padding: theme.spacing(1),
    maxWidth: 1400,
    margin: "0 auto",
    paddingLeft: 50,
    paddingRight: 20,
  },
});

const Line = ({ color }) => (
  <hr
    style={{
      backgroundColor: color,
      height: 3,
    }}
  />
);

const DashboardItem = ({ children }) => (
  <Grid xs={12} sm={12} md={12} lg={5}>
    {children}
  </Grid>
);

class Dashboard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className="dashboard">
        <div style={{ width: "100%" }}>
          <DateTimeBar />
          <Grid
            container
            className={classes.dashboard}
            justify={"space-between"}
          >
            <DashboardItem>
              <ToDo />
            </DashboardItem>
            <DashboardItem>
              <RecentNotes />
            </DashboardItem>
            <Grid item sm={12}>
              <UpcomingMeeting />
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AccountHOC(Dashboard));
