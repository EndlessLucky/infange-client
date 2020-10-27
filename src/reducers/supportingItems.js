const byTopic = (state = {}, action) => {
    const {payload} = action;
    switch (action.type) {
        case 'RECEIVE_SUPPORTINGITEMS': {
            return payload.supportingItems.reduce((p,c) => {
                if(!p.hasOwnProperty(payload._id)) {
                   p[payload._id] = [];
                }
                p[payload._id].push(c); 
                return p;
            }, {});          
        }
        case 'RECEIVE_SUPPORTINGITEM': {
            const newState = {...state};    
            if(!newState.hasOwnProperty(payload.topicID)) {
                newState[payload.topicID] = [];
            }
            newState[payload.topicID].push(payload.supportingItem);
            return newState;
        }
        case 'UPDATE_SUPPORTINGITEM': {
            return {...state, [payload.topicID]: state[payload.topicID].map(x => x._id === action.payload._id ? {...x, ...action.payload} : x)};
        }
        case 'REMOVE_SUPPORTINGITEM': {
            const newState = {...state};
            newState[payload.topicID] = newState[payload.topicID].filter(x => x._id !== payload._id);
            return newState;
        }
        default: 
            return state;
    }
}

export default byTopic