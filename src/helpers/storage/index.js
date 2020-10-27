import settings from './settings';
import token from './auth';
import axios from 'axios';

const logout = () => {
    window.localStorage.removeItem('clientID');
    window.localStorage.removeItem('refreshToken');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('profiles');
    axios.defaults.headers.common['Authorization'] = '';
}

export default {token, settings, logout}
export {token, settings}