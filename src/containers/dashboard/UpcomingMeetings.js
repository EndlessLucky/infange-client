import React from "react";
import { history } from "../../store";
import { connect } from "react-redux";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import moment from "moment";
import { UserAvatar } from "../Avatar";
import "../../common.css";
import Chip from "@material-ui/core/Chip";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { getAccountUsers } from "../../context/AccountProvider";

const axios = require("axios");

let currentDate;
let ownerID, isInvitee, isMember, isOwner;
class UpcomingMeeting extends React.Component {
  state = {
    pageNo: 0,
    upcomingMeetingsData: null,
    hasmore: false,
  };
  componentDidMount = async () => {
    this.getUpcomingMeetings(0);
    let owner = await getAccountUsers();
    ownerID = owner[0]._id;
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.meetings != this.props.meetings) this.getUpcomingMeetings(0);
  };

  getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getUpcomingMeetings = async (pageNumber) => {
    try {
      const response = await axios.get(
        `/api/meetings?upcoming=true&pageNo=${pageNumber}`
      );
      console.log("res", response.data);
      // upcomingMeetingsData = response.data
      let filteredMtngIds = [];
      response.data.mtngs.map((mtng) => {
        filteredMtngIds.push(mtng._id);
      });
      let filteredMeetings = this.props.meetings.filter((mtng) => {
        return filteredMtngIds.includes(mtng._id);
      });
      this.setState({
        upcomingMeetingsData: response.data.mtngs,
        hasmore: response.data.hasmore,
      });
    } catch (error) {
      console.error(error);
    }
  };

  viewPrevious = () => {
    if (this.state.pageNo === 0) {
    } else {
      this.setState(
        {
          pageNo: this.state.pageNo - 1,
        },
        () => this.getUpcomingMeetings(this.state.pageNo)
      );
    }
  };

  viewNext = () => {
    this.setState(
      {
        pageNo: this.state.pageNo + 1,
      },
      () => {
        this.getUpcomingMeetings(this.state.pageNo);
      }
    );
  };

  handleOnClick = (e, id) => {
    e.preventDefault();
    history.push({ pathname: `/Meetings`, state: { selectedMtng: id } });
  };

  render() {
    return (
      <div>
        <h1 className="txt">Upcoming Meetings</h1>
        <div>
          {
            <div onClick={() => this.viewPrevious()}>
              <ArrowBackIosIcon />
            </div>
          }

          {this.state.upcomingMeetingsData && (
            <div className="up" style={{ display: "flex", width: "100%" }}>
              {(currentDate = undefined)}
              {this.state.upcomingMeetingsData.map((mtng, i) => {
                isOwner = ownerID === mtng.ownerID;
                isInvitee =
                  mtng.invitees &&
                  !!mtng.invitees.find((invitee) => invitee.userID === ownerID);
                isMember = isOwner || isInvitee;
                if (
                  currentDate !==
                  moment.utc(mtng.startDate).local().format("D MMM")
                ) {
                  return (
                    <div style={{ paddingBottom: 62 }}>
                      <h2
                        style={{ marginLeft: "50px", color: "rgb(255,165,0)" }}
                      >
                        {moment.utc(mtng.startDate).local().format("D MMM")}
                      </h2>
                      <div style={{ display: "flex" }}>
                        {i != 0 && (
                          <div
                            className="upcoming-meetings-line"
                            style={{
                              width: "2px",
                              height: "120px",
                              background: "#000",
                              margin: 20,
                              marginTop: "20px",
                            }}
                          ></div>
                        )}
                        <div
                          style={{
                            margin: "15px",
                            border: !isMember ? "1.5px solid red" : "",
                            "border-radius": !isMember ? "5px" : "",
                          }}
                          onClick={
                            isMember
                              ? (e) => this.handleOnClick(e, mtng._id)
                              : null
                          }
                        >
                          <div
                            style={{
                              backgroundColor: "#e3e5e6",
                              borderTopLeftRadius: "5px",
                              borderTopRightRadius: "5px",
                              padding: "10px",
                              paddingTop: "0px",
                              width: "250px",
                              height: "70px",
                            }}
                          >
                            <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                              <div
                                style={{
                                  display: "flex",
                                  "align-items": "flex-end",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  <span style={{ margin: 5, paddingRight: 2 }}>
                                    {moment
                                      .utc(mtng.startDate)
                                      .local()
                                      .format("h:mm a")}
                                  </span>
                                  -
                                  <span style={{ paddingLeft: 5 }}>
                                    {moment
                                      .utc(mtng.endDate)
                                      .local()
                                      .format("h:mm a")}
                                  </span>{" "}
                                </div>
                                <ScheduleIcon
                                  style={{
                                    color: "rgb(255,165,0)",
                                    marginBottom: "10px",
                                  }}
                                />
                              </div>
                              <h4 style={{ margin: 5 }}>{mtng.title}</h4>
                            </div>
                          </div>
                          <div
                            style={{
                              backgroundColor: "#b0b6f5",
                              padding: "5px",
                              borderBottomRightRadius: "5px",
                              borderBottomLeftRadius: "5px",
                              width: 260,
                            }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <UserAvatar
                                upcomingMeetingAvatar={true}
                                meetingInvitees={mtng.invitees}
                              />
                              <div style={{ marginLeft: 10 }}>
                                {mtng.tags.map((tag) => {
                                  return (
                                    <Chip
                                      label={tag}
                                      style={{
                                        backgroundColor: "white",
                                        height: "21px",
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: "none" }}>
                            {
                              (currentDate = moment
                                .utc(mtng.startDate)
                                .local()
                                .format("D MMM"))
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{ margin: "15px", paddingTop: 65 }}
                      onClick={
                        isMember ? (e) => this.handleOnClick(e, mtng._id) : null
                      }
                    >
                      <div
                        style={{
                          border: !isMember ? "1.5px solid red" : "",
                          "border-radius": !isMember ? "5px" : "",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#e3e5e6",
                            borderTopLeftRadius: "5px",
                            borderTopRightRadius: "5px",
                            padding: "10px",
                            paddingTop: "0px",
                            width: "250px",
                            height: "70px",
                          }}
                        >
                          <div style={{ paddingTop: 5, paddingBottom: 5 }}>
                            <div
                              style={{
                                display: "flex",
                                "align-items": "flex-end",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <span style={{ margin: 5, paddingRight: 2 }}>
                                  {moment
                                    .utc(mtng.startDate)
                                    .local()
                                    .format("h:mm a")}
                                </span>
                                -
                                <span style={{ paddingLeft: 5 }}>
                                  {moment
                                    .utc(mtng.endDate)
                                    .local()
                                    .format("h:mm a")}
                                </span>{" "}
                              </div>

                              <ScheduleIcon
                                style={{
                                  color: "rgb(255,165,0)",
                                  marginBottom: "10px",
                                }}
                              />
                            </div>
                            <h4 style={{ margin: 5 }}>{mtng.title}</h4>
                          </div>
                        </div>
                        <div
                          style={{
                            backgroundColor: "#b0b6f5",
                            padding: "5px",
                            borderBottomRightRadius: "5px",
                            borderBottomLeftRadius: "5px",
                            width: 260,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                            }}
                          >
                            <UserAvatar
                              upcomingMeetingAvatar={true}
                              meetingInvitees={mtng.invitees}
                            />
                            <div
                              style={{
                                marginLeft: 10,
                                display: "flex",
                                flexWrap: "wrap",
                              }}
                            >
                              {mtng.tags.map((tag) => {
                                return (
                                  <Chip
                                    label={tag}
                                    style={{
                                      backgroundColor: "white",
                                      height: "21px",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "none" }}>
                          {
                            (currentDate = moment
                              .utc(mtng.startDate)
                              .local()
                              .format("D MMM"))
                          }
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          )}
          {this.state.hasmore && (
            <div
              className="arrowRight"
              onClick={() => {
                this.viewNext();
              }}
              style={{ marginLeft: "30px" }}
            >
              <ArrowForwardIosIcon />
            </div>
          )}
        </div>
        {this.state.upcomingMeetingsData &&
          this.state.upcomingMeetingsData <= 0 && (
            <div>
              <h4
                style={{
                  textAlign: "center",
                  color: "grey",
                  marginTop: "70px",
                }}
              >
                No upcoming meetings
              </h4>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    meetings: state.meetings.list,
  };
};

export default connect(mapStateToProps)(UpcomingMeeting);
