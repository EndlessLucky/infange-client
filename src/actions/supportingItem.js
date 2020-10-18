import {supportingItem as api} from '../helpers/api';


export const receiveSupportingItems = (suptngItem) => {
    return {
        type: 'RECEIVE_SUPPORTINGITEMS',
        payload: suptngItem
    }
}

export const receiveSupportingItem = (topicID, supportingItem) => {
    return {
        type: 'RECEIVE_SUPPORTINGITEM',
        payload: {topicID, supportingItem}
    }
}

export const updateSupportingItem = (meetingID, topicID, _id, supportingItem) => {
    return {
        type: 'UPDATE_SUPPORTINGITEM',
        payload: {_id: _id, meetingID, topicID, ...supportingItem}
    }
}

export const removeSupportingItem = (meetingID, topicID, _id) => {
    return {
        type: 'REMOVE_SUPPORTINGITEM',
        payload: {meetingID, topicID, _id}
    }
}

export const getSupportingItems = (meetingID, topicID) => {
    return async (dispatch) => {
        try {
            let s = await api.get(meetingID, topicID);
            s = s.data;
            dispatch(receiveSupportingItems(s));
            return s;
        }
        catch(err) {
            console.log(err);
        }
    }
}

export const createSupportingItem = (meetingID, topicID, supportingItem) => {
    return async (dispatch) => {
        try {
            let s = await api.create(meetingID, topicID, supportingItem);
            s = s.data;
            dispatch(receiveSupportingItem(topicID, s));
            return s;
        }
        catch(err) {
            let e = err.data ? err.data.message : err
            console.error(e);
            throw e;
        }
    }
}

export const editSupportingItem = (meetingID, topicID, _id, updated) => {
    return async (dispatch) => {
        try {
            let ops = [];
            for(let k in updated) {
                if(updated.hasOwnProperty(k)) {
                    ops.push({op: "replace", path: k, value: updated[k]});
                }
            }
            await api.update(meetingID, topicID, _id, ops);
            dispatch(updateSupportingItem(meetingID, topicID, _id, updated));
        }
        catch(err) {
            let e = err.data ? err.data.message : err
            console.error(e);
            throw e;
        }
    }
}


export const deleteSupportingItem = (meetingID, topicID, _id) => {
    return async (dispatch) => {
        try {
            await api.remove(meetingID, topicID, _id);
            dispatch(removeSupportingItem(meetingID, topicID, _id));
        }
        catch(err) {
            let e = err.data ? err.data.message : err
            console.error(e);
            throw e;
        }
    }
}
