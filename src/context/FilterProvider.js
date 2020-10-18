import { createContext, useEffect, useState, useContext } from "react";

import axios from "axios";

import * as React from "react";

export const FilterContext = React.createContext();

function applyFilter(a, o, f) {
  let meetings = [...o];
  if (f.myMeetings) {
    meetings = meetings.filter(x => Boolean(a.find(y => y._id === x.ownerID)));
 
  }
  meetings = meetings.filter(
    x =>
      (f.cancelled && x.status === "Cancelled") ||
      (f.inProgress && x.status === "InProgress") ||
      (f.pending && x.status === "Pending") ||
      (f.missed && x.status === "Missed") ||
      (f.ended && x.status === "Ended")
  );

  return meetings;
}

export const FilterHOC = Comp =>
  class HOC extends React.Component {
    componentDidMount() {
    }
    render() {
      return <Comp {...this.props} />;
    }
  };

const Provider = props => {
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({});

  const organizations = props.organizations;
  const account = props.account;
  const meetings = props.meetings;

  useEffect(() => {
    const data = meetings.map(x => ({
      ...x,
      organization: organizations.data
        ? organizations.data.find(y => y.id === x.organizationID).name
        : ""
    }));
    if (account.data) {
      setFiltered(applyFilter(account.data, data, filters));
    }
  }, [filters, meetings, account.data]);

  return (
    <FilterContext.Provider
      value={{
        filtered: { filtered },
        onFiltersChange: setFilters
      }}
      {...props}
    >
      {this.props.children}
    </FilterContext.Provider>
  );
};

export default React.memo(Provider);
