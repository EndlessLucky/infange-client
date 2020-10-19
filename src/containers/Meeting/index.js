import { connect } from "react-redux";
import {
  deleteMeeting,
  updateMeetingTags,
  editMeeting,
} from "../../actions/meeting";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import OpenIcon from "@material-ui/icons/Launch";
import { history } from "../../store";
import Grid from "@material-ui/core/Grid";
import { AccountHOC } from "../../context/AccountProvider";
import {
  OrganizationHOC,
  getOrganizations,
} from "../../context/OrganizationProvider";
import { OrganizationContext } from "../../context/OrganizationProvider";
import React, { PureComponent } from "react";
import MeetingSideBar from "../../components/MeetingSideBar";
import ViewMeeting from "./View";

const styles = {
  table: {
    overflowX: "auto",
    // marginLeft: "50px",
    // marginRight: "50px"
  },
  buttonview: {
    display: "flex",
    justifyContent: "space-between",
  },
  description: {
    maxWidth: 200,
    display: "flex",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  view: {
    display: "inline-block",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

const handleEditClick = (id) => () => {
  history.push(`/Meetings/${id}`);
};

class MeetingView extends PureComponent {
  static contextType = OrganizationContext;
  state = {
    view: "card",
    filters: {},
    filtered: [],
    filterOpen: false,
    selectedMeeting: null,
    minimize: false,
  };

  matches = true; //TODO
  constructor(props) {
    super(props);

    this.state.orgState = props.organizations;
    this.state.filtered = props.meetings || [];
    this.state.udpateFilter = false;

    // This probably needs a default prop... likely to use local storage to maintain user config through sessions
    this.state.filters = {
      cancelled: true,
      inProgress: true,
      pending: true,
      missed: true,
      ended: true,
      owners: [],
      invitees: [],
      tagState: [],
    };
  }

  handleTagUpdate = async (tags, mtngID, newTag = false) => {
    await updateMeetingTags(tags, mtngID, newTag ? newTag : false).then(
      async (response) => {
        const index = this.state.filtered.findIndex(
          (x) => x._id == response.data._id
        );
        let newFiltered = this.state.filtered;
        newFiltered[index] = response.data;
        this.applyFilter(this.state.filters, newFiltered);
        this.setState({ selectedMeeting: response.data });
        if (newTag) {
          let updatedOrganizations = await getOrganizations();
          this.setState({ orgState: updatedOrganizations });
        }
      }
    );
    return;
  };

  applyFilter = (filters, meetings = this.props.meetings) => {
    if (
      this.props.users &&
      this.props.users.allIDs.length > 0 &&
      this.props.organizations &&
      this.props.organizations.length > 0
    ) {
      meetings = this.formatData(
        meetings,
        this.props.users,
        this.props.organizations
      );
      if (this.props.account) {
        const currUserID = this.props.account[0]._id;

        meetings = meetings.filter((meeting) => {
          const isInvitee =
            meeting.invitees &&
            !!meeting.invitees.find((invitee) => invitee.userID === currUserID);
          return meeting.ownerID == currUserID || isInvitee;
        });
      }
      this.setState({
        filtered: meetings.filter(
          (x) =>
            ((filters.cancelled && x.status === "Cancelled") ||
              (filters.inProgress && x.status === "InProgress") ||
              (filters.pending && x.status === "Pending") ||
              (filters.missed && x.status === "Missed") ||
              (filters.ended && x.status === "Ended")) &&
            filters.tagState &&
            (filters.tagState.length === 0 ||
              filters.tagState.every((tag) => x.tags.includes(tag)))
        ),
        filters,
      });
    }
  };

  componentDidMount() {
    if (this.props.meetings !== []) this.setState({ udpateFilter: true });
    if (
      this.props.location.status &&
      this.props.location.state.selectedMeeting
    ) {
      const s = this.props.meetings.find(
        (mtng) => mtng._id == this.props.location.state.selectedMeeting
      );
      console.log(s);
      if (this.state.selectedMeeting != s){
        this.setState({ selectedMeeting: s });
      }        
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.organizations.length > 0 &&
      this.props.users &&
      this.props.users.allIDs.length > 0 &&
      (prevProps.meetings !== this.props.meetings || this.state.udpateFilter)
    ) {
      this.setState({ udpateFilter: false });
      this.applyFilter(this.state.filters);
    }
  }

  getHeaders = (classes) => {
    return [
      { key: "organization", title: "Organization", sortable: true },
      { key: "title", title: "Title", sortable: true },
      {
        key: "status",
        title: "Status",
        sortable: true,
        cell: (d) => <span className={classes.description}>{d}</span>,
      },
      {
        key: "location",
        title: "Create Location",
        sortable: true,
        cell: (d) => <span className={classes.description}>{d}</span>,
      },
      {
        key: "startDate",
        title: "Start Date",
        sortable: true,
        cell: (d) => moment(d).format("MM/DD/YYYY h:mm A"),
      },
      {
        key: "endDate",
        title: "Duration",
        sortable: true,
      },
      {
        key: "invitees",
        title: "Invitees",
        sortable: true,
        cell: (d) => <span className={classes.description}>{d}</span>,
      },
      {
        key: "_id",
        title: "",
        sortable: false,
        props: {
          style: { width: "1%", padding: "0 10px 0 0" },
        },
        cell: (id) => (
          <IconButton onClick={handleEditClick(id)}>
            <OpenIcon />
          </IconButton>
        ),
      },
    ];
  };

  formatEndDate = (entry) => {
    const msec = moment(entry.endDate) - moment(entry.startDate);
    const mins = Math.floor(msec / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    const minutes = mins % 60;
    const hours = hrs % 24;

    return days + " days, " + hours + " hours, " + minutes + " minutes";
  };

  formatData = (data, users, organizations) => {
    const formattedData = data.map((entry) => {
      let newEntry = { ...entry };
      newEntry.key = entry._id;

      newEntry.endDate = this.formatEndDate(entry);
      newEntry.endTime = entry.endDate;

      newEntry.inviteesObj = entry.invitees;
      newEntry.invitees = entry.invitees;
      // .map(
      //   y =>
      //     `${users.byID[y.userID].firstName} ${
      //       users.byID[y.userID].lastName
      //     } `
      // )
      // .join(", ");

      newEntry.organization =
        organizations.find((org) => org.id == newEntry.organizationID).name ||
        "";

      return newEntry;
    });

    return formattedData;
  };

  onMeetingSelect = (mtng) => {
    this.setState({ selectedMeeting: mtng });
  };

  onMinimize = () => {
    this.setState({ minimize: !this.state.minimize });
  };

  setSelectedNull = () => {
    this.setState({
      selectedMeeting: null,
    });
  };

  render() {
    const {
      users,
      meetings,
      startDate,
      endDate,
      classes,
      account,
      ...props
    } = this.props;
    const organizations = this.state.orgState;
    if (!users.allIDs.length || !organizations) {
      return null; //TODO: This should be a loading icon
    }

    return (
      <div style={{ width: "100%" }}>
        <Grid
          container
          spacing={30}
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          <div style={{ display: "flex" }}>
            <MeetingSideBar
              meetings={this.state.filtered}
              selectedMtng={this.state.selectedMeeting}
              onSelect={(mtng) => this.onMeetingSelect(mtng)}
              setSelectedNull={this.setSelectedNull}
              editMeeting={this.props.edit}
              organizations={this.props.organizations}
              onFilterChange={(params) => {
                // console.log("filtereddd", { ...params });
                this.applyFilter({ ...params });
              }}
              userID={this.props.account[0] && this.props.account[0]._id}
              owner={
                this.state.selectedMeeting &&
                this.props.users.byID[this.state.selectedMeeting.ownerID]
              }
              minimize={this.state.minimize}
              account={this.props.account}
            />
          </div>
          <div style={{ width: "100%" }}>
            {this.state.selectedMeeting && (
              <ViewMeeting
                id={this.state.selectedMeeting._id}
                meetingTags={
                  this.state.selectedMeeting && this.state.selectedMeeting.tags
                }
                minimize={this.state.minimize}
                onMinimize={this.onMinimize}
                organization={this.props.organizations[0]}
                handleTagUpdates={(tags, mtngID, newTag) =>
                  this.handleTagUpdate(tags, mtngID, newTag ? newTag : false)
                }
              />
            )}
            {!this.state.selectedMeeting && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  fontWeight: "bold",
                  color: "rgb(113, 105, 163)",
                }}
              >
                You have no meetings scheduled for this week
              </div>
            )}
          </div>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users,
    meetings: state.meetings.list,
  };
};
const mapDispatchToProps = (dispatch) => ({
  edit: (mtng) => dispatch(editMeeting(mtng)),
  remove: (mtng) => dispatch(deleteMeeting(mtng)),
});

const MeetingViewWrapper = OrganizationHOC(AccountHOC(MeetingView));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(MeetingViewWrapper));
