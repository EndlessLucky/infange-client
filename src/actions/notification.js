import {notification as api} from '../helpers/api';

export const receiveNotifications = (notifications) => {
    return {
        type: 'RECEIVE_NOTIFICATIONS',
        payload: notifications
    }
}

export const receiveNotification = (notification) => {
    return {
        type: 'RECEIVE_NOTIFICATION',
        payload: notification
    }
}

export const removeNotification = (notification) => {
    return {
        type: 'REMOVE_NOTIFICATION',
        payload: notification
    }
}

export const markReadNotification = (notification) => {
    return {
        type: 'READ_NOTIFICATION',
        payload: notification
    }
}

export const getNotifications = (userId) => {
    return async (dispatch) => {
        try {
            let o = await api.get(userId);
            o = o.data;

            dispatch(receiveNotifications(o));
            return o;
        }
        catch(err) {
            if(err && err.data && err.data.message) {
                throw err.data.message;
            } else {
                throw 'Something went wrong';
            }
        }
    }
}

export const addNotification = (notification) => {
    return async (dispatch) => {
        try {
            dispatch(receiveNotification(notification));
            return notification;
        }
        catch(err) {
            console.error(err.data.message);
            throw err.data.message;
        }
    }
}

export const readNotification = (notification) => {
    return async (dispatch) => {
        try {
            
            let o = await api.patch(notification._id);
            o = o.data;

            dispatch(markReadNotification(notification));
            return notification;
        }
        catch(err) {
            console.error(err.data.message);
            throw err.data.message;
        }
    }
}

export const deleteNotification = (notification) => {
    return async (dispatch) => {
        try {
            let o = await api.delete(notification._id);
            o = o.data;

            dispatch(removeNotification(notification));
            return notification;
        }
        catch(err) {
            console.error(err.data.message);
            throw err.data.message;
        }
    }
}
