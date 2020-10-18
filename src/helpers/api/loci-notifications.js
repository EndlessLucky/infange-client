import axios from 'axios';

const HOST = '/api';

function url() {
    return HOST;
}

function notificationUrl(userId) {
    return `${url()}/notifications/user/${userId}`
}

function notificationReadUrl(notificationId) {
    return `${url()}/notifications/${notificationId}/read`
}

function notificationDeleteUrl(notificationId) {
    return `${url()}/notifications/${notificationId}`
}

export const notification = {
    /**
     * @param {ObjectId} [objID]
     * @returns {Promise<AxiosPromise<any>>}
     */
    get: async (userId) => {
        return axios.get(notificationUrl(userId));
    },
    patch: async (notificationId) => {
        return axios.patch(notificationReadUrl(notificationId));
    },
    delete: async (notificationId) => {
        return axios.delete(notificationDeleteUrl(notificationId));
    },
};