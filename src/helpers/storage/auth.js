const v = {};

export default {
    get access() {
        return window.localStorage.getItem('accessToken');
    },
    get clientID() {
        if(!v.clientID) {
            v.clientID = window.localStorage.getItem('clientID');
        }
        return v.clientID;
    },
    set access(token) {
        let t = JSON.parse(window.atob(token.split('.')[1]));
        window.localStorage.setItem('accessToken', token);
        window.localStorage.setItem('clientID', t.sub);
        window.localStorage.setItem('profiles', JSON.stringify(t.data));

        delete v.accessToken;
        delete v.clientID;
        delete v.profiles;

    },

    get profiles() {
        try {
            if(!v.profiles) {
                v.profiles = JSON.parse(window.localStorage.getItem('profiles')) || [];
            }
            return v.profiles;
        }
        catch(err) {
            console.warn(err);          
        }
        return [];
    },
    get refresh() {
        if(!v.refreshToken) {
            v.refreshToken = window.localStorage.getItem('refreshToken');
        }
        return v.refreshToken;
    },

    // get users() {
    //     let t = JSON.parse(window.atob(this.access.split('.')[1]));
    //     return t.data.map(x => x._id);
    // },
    set refresh(token) {
        window.localStorage.setItem('refreshToken', token);
        delete v.refreshToken;
    }
}