import { combineReducers } from "redux";

const byID = (state = {}, action) => {
  switch (action.type) {
    case "RECEIVE_OBJECTIVES": {
      const { payload } = action;
      return payload.reduce((p, c) => {
        p[c._id] = c;
        return p;
      }, {});
    }
    case "UPDATE_OBJECTIVE": {
      const { payload } = action;
      return { ...state, [payload._id]: payload };
    }
    case "REMOVE_OBJECTIVE": {
      const { payload } = action;
      const newState = { ...state };
      delete newState[payload._id];
      return newState;
    }
    default:
      return state;
  }
};

const list = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_OBJECTIVES": {
      return action.payload;
    }
    case "UPDATE_OBJECTIVE": {
      return state.map(x =>
        x._id === action.payload._id ? action.payload : x
      );
    }
    case "REMOVE_OBJECTIVE": {
      const { payload } = action;
      return state.filter(x => x._id !== payload._id);
    }
    default:
      return state;
  }
};

const allIDs = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_OBJECTIVES": {
      const { payload } = action;
      return payload.map(x => x._id);
    }
    case "REMOVE_OBJECTIVE": {
      const { payload } = action;
      return state.filter(x => x !== payload._id);
    }
    default:
      return state;
  }
};

const byMeeting = (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    case "RECEIVE_OBJECTIVES": {
      return payload.reduce((p, c) => {
        if (c.meetings) {
          c.meetings.map(value => {
            if (!p[value]) {
              p[value] = [];
            }
            p[value].push(c);
          });
        }
        return p;
      }, {});
    }
    case "UPDATE_OBJECTIVE": {
      if (payload.meetings && state[payload.meetings[0]]) {
        let arr = [...state[payload.meetings[0]]];
        arr = arr.map(x => (x._id === payload._id ? payload : x));
        return { ...state, [payload.meetings[0]]: arr };
      }
    }
    case "REMOVE_OBJECTIVE": {
      if (payload.meetings && state[payload.meetings[0]]) {
        let arr = [...state[payload.meetings[0]]];
        arr = arr.filter(x => x._id !== payload._id);
        return { ...state, [payload.meetings[0]]: arr };
      }
    }
    default:
      return state;
  }
};

const profileID = (state = null, action) => {
  switch (action.type) {
    case "RECEIVE_PROFILE_ID": {
      const { payload } = action;
      return payload;
    }
    default:
      return state;
  }
};

export default combineReducers({ byID, allIDs, profileID, list, byMeeting });
