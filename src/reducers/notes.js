import { combineReducers } from "redux";

const list = (state = [], action) => {
    switch (action.type) {
        case "RECEIVE_NOTES": {
            return action.payload;
        }
        case "UPDATE_NOTE": {
            return state.map(x =>
                x._id === action.payload._id ? action.payload : x
            );
        }
        case "REMOVE_NOTE": {
            const { payload } = action;
            return state.filter(x => x._id !== payload._id);
        }
        default:
            return state;
    }
};

const byID = (state = {}, action) => {
    switch (action.type) {
        case "RECEIVE_NOTES": {
            const { payload } = action;
            return payload.reduce((p, c) => {
                p[c._id] = c;
                return p;
            }, {});
        }
        case "UPDATE_NOTE": {
            const { payload } = action;
            return { ...state, [payload._id]: payload };
        }
        case "REMOVE_NOTE": {
            const { payload } = action;
            const newState = { ...state };
            delete newState[payload._id];
            return newState;
        }
        default:
            return state;
    }
};

const allIDs = (state = [], action) => {
    switch (action.type) {
        case "RECEIVE_NOTES": {
            const { payload } = action;
            return payload.map(x => x._id);
        }
        case "REMOVE_NOTE": {
            const { payload } = action;
            return state.filter(x => x !== payload._id);
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

export default combineReducers({ byID, allIDs, profileID, list });