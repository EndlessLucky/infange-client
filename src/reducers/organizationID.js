
const organizationID = (state = "", action) => {
    switch (action.type) {
        case 'RECEIVE_ORGANIZATIONID': {
            return action.payload;
        }
        default:
            return state;    
    }
}

export default organizationID;