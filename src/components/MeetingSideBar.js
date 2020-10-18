import React, { useState, useEffect } from "react";
import moment from "moment";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import DateFilter from "./DateFilter";
import getIconForStatus from "../helpers/getIconForStatus";

const Cancelled = getIconForStatus("Cancel");
const Completed = getIconForStatus("Done");
const Missed = getIconForStatus("Missed");
const Pending = getIconForStatus("Pending");
const InProgress = getIconForStatus("InProgress");

const styles = () => ({
  mgTop10: {
    marginTop: 10,
  },
});

const day = new Date().getDay(),
  startDiff = new Date().getDate() - day,
  endDiff = new Date().getDate() + 6 - day;

const MeetingSideBar = ({
  meetings,
  onSelect,
  editMeeting,
  organizations,
  onFilterChange,
  selectedMtng,
  owner,
  userID,
  minimize,
  account,
  setSelectedNull,
}) => {
  const classes = styles();
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(startDiff))
  );
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(endDiff)));
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(
    selectedMtng && selectedMtng._id
  );

  useEffect(() => {
    if (!selectedMtng && meetings.length > 0)
      getFirstMtng([startDate, endDate]);
  });

  const isOwner = owner && owner._id === userID;

  const userInvite =
    selectedMtng &&
    selectedMtng.invitees.find((invitee) => invitee.userID === userID);
  const isAccepted = userInvite && userInvite.requestStatus === "Accept";
  const isDeclined = userInvite && userInvite.requestStatus === "Decline";
  const isMember = isOwner || isAccepted;

  const getFirstMtng = (dates) => {
    const sortedMeetings = meetings.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    const mtng = sortedMeetings.find(
      (i) =>
        new Date(i.startDate).getTime() >=
          new Date(dates[0].setHours(0, 0, 0)).getTime() &&
        new Date(i.startDate).getTime() <
          new Date(dates[1].setHours(23, 59, 59)).getTime()
    );
    onSelect(mtng);
  };

  const onChange = (dates) => {
    const [start, end] = dates;
    const day = new Date(start).getDay(),
      startDiff = new Date(start).getDate() - day,
      endDiff = new Date(start).getDate() + 6 - day;
    const startD = new Date(new Date(start).setDate(startDiff));
    const endD = new Date(new Date(start).setDate(endDiff));
    setStartDate(startD);
    setEndDate(endD);
    getFirstMtng([startD, endD]);
  };

  useEffect(() => {
    if (selectedMtng && selectedMtng._id != selectedMeeting) {
      setSelectedMeeting(selectedMtng._id);
      onChange([selectedMtng.startDate]);
    }
  }, [selectedMtng]);

  const handleOnClick = (e) => {
    e.stopPropagation();
    if (e.target.id) {
      setSelectedMeeting(e.target.id);
      const selectedMtng = meetings.find((mtng) => mtng._id == e.target.id);
      onSelect(selectedMtng);
    }
  };

  const handleLeftArrow = () => {
    let newStartDate = new Date(startDate),
      newEndDate = new Date(endDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    newEndDate.setDate(newEndDate.getDate() - 7);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedNull();
    getFirstMtng([newStartDate, newEndDate]);
  };

  const handleRightArrow = () => {
    let newStartDate = new Date(startDate),
      newEndDate = new Date(endDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setSelectedNull();
    getFirstMtng([newStartDate, newEndDate]);
  };

  const sortMeetings = (payload) => {
    let sorted = payload.sort((a, b) => {
      if (a.startDate < b.startDate) return -1;
      if (a.startDate > b.startDate) return 1;
      return 0;
    });
    return sorted;
  };

  return (
    <div
      style={{ borderRight: "1px solid #bdbdbd", width: minimize ? 0 : 225 }}
    >
      {!minimize && (
        <DateFilter
          handleLeftArrow={handleLeftArrow}
          handleRightArrow={handleRightArrow}
          onFilterClick={() => setFilterOpen(!filterOpen)}
          startDate={startDate}
          endDate={endDate}
          onDateChange={onChange}
          filterOpen={filterOpen}
          onFilterClose={() => setFilterOpen(false)}
          onFilterChange={onFilterChange}
          organizations={organizations}
          account={account}
          meetings={true}
        />
      )}
      <div style={{ overflowY: "auto", height: "82vh" }}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          let mtngs = [];
          if (meetings.length > 0)
            mtngs =
              meetings.filter(
                (mt) =>
                  new Date(mt.startDate).getTime() >=
                    new Date(
                      moment.utc(startDate).add(day, "days").format()
                    ).getTime() &&
                  new Date(mt.startDate).getTime() <
                    new Date(
                      moment
                        .utc(startDate)
                        .add(day + 1, "days")
                        .format()
                    ).getTime()
              ) || [];

          if (mtngs.length > 0) mtngs = sortMeetings(mtngs);
          return (
            <div>
              <div
                style={{
                  background:
                    moment
                      .utc(startDate)
                      .add(day, "days")
                      .local()
                      .format("MMDDYYYY") == moment().format("MMDDYYYY")
                      ? "#7169A3"
                      : "#F0EFF8",
                  padding: 10,
                  display: "flex",
                  justifyContent: "center",
                  fontSize: 11,
                  color:
                    moment
                      .utc(startDate)
                      .add(day, "days")
                      .local()
                      .format("MMDDYYYY") == moment().format("MMDDYYYY")
                      ? "#FFFFFF"
                      : "#000000",
                }}
              >
                <span>
                  {moment(new Date(startDate))
                    .add(day, "days")
                    .format("dddd, MMMM DD")}
                </span>
              </div>
              {mtngs.length === 0 && <div style={{ minHeight: 10 }}></div>}
              {mtngs.map((mtng) => {
                return (
                  <div
                    className={
                      new Date(mtng.startDate).getTime() < new Date().getTime()
                        ? null
                        : classes.mgTop10
                    }
                  >
                    <div
                      id={mtng._id}
                      style={{
                        margin: 10,
                        border: "1px solid #e0e0e0",
                        borderRadius: 5,
                      }}
                      onClick={(event) => handleOnClick(event)}
                    >
                      <Card id={mtng._id}>
                        <CardContent
                          id={mtng._id}
                          style={{
                            display: "flex",
                            backgroundColor:
                              mtng._id == selectedMeeting
                                ? "#807AA5"
                                : mtng.status == "Ended"
                                ? "#F6F6F6"
                                : "white",
                            color: mtng._id == selectedMeeting ? "#fff" : null,
                          }}
                        >
                          <div id={mtng._id} style={{ width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                marginBottom: 10,
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <h6 id={mtng._id} style={{ margin: 0 }}>
                                {mtng.title}
                              </h6>
                              {mtng.status == "Ended" ? (
                                isMember ? (
                                  <Completed
                                    style={{ fill: "#74B57C", width: 25 }}
                                  />
                                ) : (
                                  <Missed
                                    style={{ fill: "#FFE034", width: 25 }}
                                  />
                                )
                              ) : mtng.status == "Cancelled" ? (
                                <Cancelled
                                  style={{
                                    width: 25,
                                    fill: "#FFE034",
                                    fontWeight: 100,
                                  }}
                                />
                              ) : mtng.status == "Pending" ? (
                                <Pending
                                  style={{
                                    width: 20,
                                    fill: "#FFE034",
                                    fontWeight: 100,
                                  }}
                                />
                              ) : mtng.status == "InProgress" ? (
                                <InProgress
                                  style={{
                                    width: 25,
                                    fill: "#74B57C",
                                    fontWeight: 100,
                                  }}
                                />
                              ) : null}
                            </div>
                            <div
                              id={mtng._id}
                              style={{
                                display: "flex",
                                width: "100%",
                                justifyContent: "space-between",
                              }}
                            >
                              <p
                                id={mtng._id}
                                style={{ margin: 0, fontSize: 8 }}
                              >
                                {mtng.status}
                              </p>
                              <div
                                id={mtng._id}
                                style={{
                                  margin: 0,
                                  marginLeft: 10,
                                  fontSize: 8,
                                }}
                              >
                                {moment(mtng.startDate).format("LT")}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MeetingSideBar;
