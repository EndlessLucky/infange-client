import {token} from '../helpers/storage';

const profile = (state = [], action) => {
    switch (action.type) {
        case 'RECEIVE_PROFILES': {
            return action.payload;
        }
        case 'UPDATE_PROFILE': {
            const {payload} = action;
            return state.map(x => x._id === action._id ? payload : x);
        }
        case 'RECEIVE_USERS': {
            const {payload} = action;
            return payload.filter(x => x.clientID === token.clientID)
        }
        case 'UPDATE_USER': {
            const {payload} = action;
            return state.map(x => x._id === payload._id ? payload : x);
        }
        default:
            return state;
    }    
}

export default profile;