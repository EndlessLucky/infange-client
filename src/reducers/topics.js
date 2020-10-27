import { combineReducers } from "redux";

const list = (state = [], action) => {
  switch (action.type) {
    case "RECEIVE_TOPICS": {
      return action.payload;
    }
    case "RECEIVE_TOPIC": {
      const { payload } = action;
      const newState = {...state};
      newState.topics.push(payload);
      return newState;
    }
    case "UPDATE_TOPIC": {
      return state.map(x =>
        x._id === action.payload._id ? { ...x, ...action.payload } : x
      );
    }
    case "REMOVE_TOPIC": {
      const { payload } = action;
      return { ...state, topics: state.topics.filter(x => x._id !== payload.topicID) };
    }
    default:
      return state;
  }
};

const byID = (state = {}, action) => {
  switch (action.type) {
    case "RECEIVE_TOPICS": {
      const { payload } = action;
      if(payload.topics && payload.topics.length) {
        return payload.topics.reduce((p, c) => {
          p[c._id] = c;
          return p;
        }, {});
      } else {
        return {
          [payload._id]: {
            topics: []
          }
        };
      }
    }
    case "RECEIVE_TOPIC": {
      const { payload } = action;
      const newState = { ...state };
      newState[payload._id] = payload;
      return newState;
    }
    case "UPDATE_TOPIC": {
      const { payload } = action;
      return { ...state, [payload._id]: { ...state[payload._id], ...payload } };
    }
    case "REMOVE_TOPIC": {
      const { payload } = action;
      const newState = { ...state };
      delete newState[payload.topicID];
      return newState;
    }
    default:
      return state;
  }
};

const byMeeting = (state = {}, action) => {
  const { payload } = action;
  switch (action.type) {
    case "RECEIVE_TOPICS": {
      return { ...state, [payload.meetingID]: payload.topics || [] };
    }
    case "UPDATE_TOPIC": {
      return {
        ...state,
        [payload.meetingID]: state[payload.meetingID].map(x =>
          x._id === action.payload._id ? { ...x, ...action.payload } : x
        )
      };
    }
    case "RECEIVE_TOPIC": {
      const newState = { ...state };
      if (!newState.hasOwnProperty(payload.meetingID)) {
        newState[payload.meetingID] = [];
      }
      newState[payload.meetingID].push(payload);
      return newState;
    }
    case "REMOVE_TOPIC": {
      const newState = { ...state };
      newState[payload.meetingID] = newState[payload.meetingID].filter(
        x => x._id !== payload.topicID
      );
      return newState;
    }
    default:
      return state;
  }
};

export default combineReducers({ byID, list, byMeeting });
