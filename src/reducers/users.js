import {combineReducers} from 'redux';

const colors = ["#ff9800", "#673ab7", "#4caf50", "#f44336", "#2196f3"];
const colorWheel = {};
let index = 0;
let iter = 0;
function selectColor(firstLetter) {
    let i = index % colors.length;
    if(colorWheel[firstLetter] && colorWheel[firstLetter].includes(colors[i]) && iter < colors.length) {
        index++;
        iter++;
        return selectColor(firstLetter);
    }
    if(!colorWheel[firstLetter]) {
        colorWheel[firstLetter] = [];
    }
    colorWheel[firstLetter].push(colors[i]);
    index++;
    return colors[i];
}

const byID = (state = {}, action) => {
    switch (action.type) {
        case 'RECEIVE_USERS': {
            const {payload} = action;
            let index = 0;
            return payload.reduce((p,c) => {

                c.color = selectColor(c.firstName[0]);
                p[c._id] = c;
                return p;
            }, {});
        }
        case 'UPDATE_USER': {
            const {payload} = action;
            return {...state, [payload._id]: payload};
        }
        case 'REMOVE_USER': {
            const {payload} = action;
            const newState = {...state};
            delete newState[payload._id];
            return newState;
        }

        default:
            return state;
    }
}

const allIDs = (state = [], action) => {
    switch (action.type) {
        case 'RECEIVE_USERS': {
            const {payload} = action;
            let sorted = payload.sort((a,b) => {
                if(a.firstName < b.firstName) return -1;
                if(a.firstName > b.firstName) return 1;
                if(a.lastName < b.lastName) return -1;
                if(a.lastName > b.lastName) return 1;
                return 0;
            });
            return sorted.map(x => x._id);
        }

        case 'REMOVE_USER': {
            const {payload} = action;
            return state.filter(x => x !== payload._id);
        }

        default:
            return state;
    }
}

const ddl = (state = null, action) => {
    switch (action.type) {
        case 'RECEIVE_USERS': {
            const {payload} = action;
            return payload.map(x => {
                return {
                    label: `${x.firstName} ${x.lastName}`,
                    value: x._id
                }
            });
        }
        case 'UPDATE_USER': {
            const {payload} = action;
            return state.map(x => x._id === payload._id ? payload : x);
        }
        case 'REMOVE_USER': {
            const {payload} = action;
            return state.filter(x => x !== payload._id);
        }

        default:
            return state;
    }
}

const profileID = (state = null, action) => {
    switch (action.type) {
        case 'RECEIVE_PROFILE_ID': {
            const {payload} = action;
            return payload;
        }
        default:
            return state;
    }
}

const avatars = (state = {}, action) => {
    switch(action.type) {
        case 'RECEIVE_AVATARS': {
            const {payload} = action;
            return payload;
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({byID, allIDs, profileID, ddl, avatars});