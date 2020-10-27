import React, { useState } from "react";
import DatePicker from "react-datepicker";
import EventIcon from "@material-ui/icons/Event";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import IconButton from "@material-ui/core/IconButton";
import FilterIcon from "@material-ui/icons/FilterList";
import FilterObjs from "../containers/Objective/FilterObjectives";
import FilterMtngs from "../containers/Meeting/FilterMeetings";
import moment from "moment";

const DateFilter = ({
  handleLeftArrow,
  handleRightArrow,
  onFilterClick,
  startDate,
  endDate,
  onDateChange,
  filterOpen,
  onFilterClose,
  onFilterChange,
  organizations,
  account,
  meetings,
  objectives,
}) => {
  const ExampleCustomInput = ({ value, onClick }) => (
    <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <EventIcon onClick={onClick} style={{ width: 20, height: "100%" }} />
    </div>
  );

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          background: "#e0e0e0",
          paddingRight: 10,
          paddingLeft: 10,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", paddingLeft: 10 }}>
          <ArrowBackIosIcon
            onClick={handleLeftArrow}
            style={{ cursor: "pointer", width: 12, padding: 8 }}
          />
          <span style={{ paddingLeft: 5, paddingRight: 5, fontSize: 11 }}>
            {moment(startDate).format("MMM DD")}
          </span>
          -
          <span style={{ paddingLeft: 5, paddingRight: 5, fontSize: 11 }}>
            {moment(endDate).format("DD")}
          </span>
          <ArrowForwardIosIcon
            onClick={handleRightArrow}
            style={{ cursor: "pointer", width: 12, padding: 7 }}
          />
        </div>
        <IconButton onClick={onFilterClick}>
          <FilterIcon />
        </IconButton>
        <DatePicker
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          popperPlacement="bottom-center"
          customInput={<ExampleCustomInput />}
          onChange={onDateChange}
        />
      </div>
      {objectives && (
        <FilterObjs
          open={filterOpen}
          onClose={onFilterClose}
          onFilterChange={onFilterChange}
          locked={false}
          organizations={organizations.data}
        />
      )}
      {meetings && (
        <FilterMtngs
          open={filterOpen}
          onClose={onFilterClose}
          onFilterChange={onFilterChange}
          locked={false}
          organizations={organizations}
          account={account}
        />
      )}
    </React.Fragment>
  );
};

export default DateFilter;
