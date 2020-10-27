import React from "react";
import { connect } from "react-redux";
import { history } from "../../store";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import { Grid } from "@material-ui/core";

const axios = require("axios");

class RecentNotes extends React.Component {
  state = {
    pageNo: 0,
    recentNotesData: null,
  };

  componentDidMount = () => {
    this.getRecentNotes(0);
  };

  getRandomColor = () => {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  componentDidUpdate = (prevProps) => {
    console.log(
      "pppp",
      prevProps.notes,
      this.props.notes,
      prevProps.notes != this.props.notes
    );
    if (prevProps.notes != this.props.notes) this.getRecentNotes(0);
  };

  getRecentNotes = async (pageNumber) => {
    try {
      const response = await axios.get(
        `/api/notes?recent=true&pageNo=${pageNumber}`
      );

      // upcomingMeetingsData = response.data
      this.setState({
        recentNotesData: response.data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    console.log("recentNotes", this.state.recentNotesData);
    return (
      <div>
        <h1 style={{ textAlign: "left" }}>Recent Notes</h1>
        <Grid container style={{ marginTop: 20 }}>
          {this.state.recentNotesData &&
            this.state.recentNotesData.length > 0 &&
            this.state.recentNotesData.map((recentNotes) => {
              return (
                <Grid
                  item
                  xs={12}
                  className="recent-notes"
                  style={{
                    cursor: "pointer",
                    marginTop: 20,
                    overflow: "hidden",
                  }}
                  onClick={() =>
                    history.push({
                      pathname: "/Notes",
                      search: "",
                      state: { selectedNote: recentNotes._id },
                    })
                  }
                >
                  <Grid container style={{ flexWrap: "noWrap" }}>
                    <Grid
                      item
                      style={{
                        backgroundColor: "rgb(255,165,0)",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        display: "flex",
                        flex: "0 0 50px",
                        alignItems: "center",
                        borderTopLeftRadius: "5px",
                        borderBottomLeftRadius: "5px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "center",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                        }}
                      >
                        <p style={{ margin: 0 }}>
                          {moment
                            .utc(recentNotes.createDate)
                            .local()
                            .format("D")}
                        </p>
                        <p style={{ margin: 0 }}>
                          {moment
                            .utc(recentNotes.createDate)
                            .local()
                            .format("MMM")}
                        </p>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      style={{
                        //display: "flex",
                        //justifyContent: "space-between",
                        //alignItems: "center",
                        backgroundColor: "#e3e5e6",
                        borderTopRightRadius: "5px",
                        borderBottomRightRadius: "5px",
                        padding: "20px",
                        // width: "85%",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: "#f44336",
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {recentNotes.title}
                        </span>
                        {!recentNotes.title && (
                          <span
                            style={{
                              margin: "0 16px",
                              visibility: "hidden",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            text
                          </span>
                        )}
                        {/* <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: recentNotes.text,
                            }}
                            style={{ flex: 10 }}
                          />
                        </div> */}
                      </div>

                      {recentNotes.tags.map((tag) => {
                        return (
                          <Chip
                            label={tag}
                            style={{ backgroundColor: "white", height: "21px" }}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
          {this.state.recentNotesData &&
            this.state.recentNotesData.length <= 0 && (
              <h4 style={{ color: "grey" }}>No recent notes</h4>
            )}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notes: state.notes.list,
  };
};

export default connect(mapStateToProps)(RecentNotes);
