import { combineReducers } from "redux";

const list = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_MEETINGS": {
      return action.payload;
    }
    case "UPDATE_MEETING": {
      return state.map((x) =>
        x._id === action.payload._id ? action.payload : x
      );
    }
    case "REMOVE_MEETING": {
      const { payload } = action;
      return state.filter((x) => x._id === payload._id);
    }
    default:
      return state;
  }
};

const byID = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case "RECEIVE_MEETINGS": {
      return payload.reduce((p, c) => {
        p[c._id] = c;
        return p;
      }, {});
    }
    case "UPDATE_MEETING": {
      return { ...state, [payload._id]: payload };
    }
    case "REMOVE_MEETING": {
      const newState = { ...state };
      delete newState[payload._id];
      return newState;
    }
    case "REMOVE_INVITEE": {
      let mtng = { ...state[payload.meetingID] };
      mtng.invitees = mtng.invitees.filter(
        (x) => x.userID !== payload.inviteeID
      );
      return { ...state, [payload.meetingID]: mtng };
    }
    case "RECEIVE_INVITEE": {
      let mtng = { ...state[payload.meetingID] };
      let invitees = { ...payload };
      // mtng.invitees.push(invitees);
      return { ...state, [payload.meetingID]: mtng };
    }
    default:
      return state;
  }
};

const allIDs = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_MEETINGS": {
      const { payload } = action;
      let sorted = payload.sort((a, b) => {
        if (a.startDate < b.startDate) return 1;
        if (a.startDate > b.startDate) return -1;
        return 0;
      });
      return sorted.map((x) => x._id);
    }

    case "REMOVE_MEETING": {
      const { payload } = action;
      return state.filter((x) => x !== payload._id);
    }

    default:
      return state;
  }
};

export default combineReducers({ byID, allIDs, list });
