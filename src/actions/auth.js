import api from '../helpers/api';
const u = '5adf91274d777d68700b0ca1';

export const getToken = () => {
    return async function(dispatch) {
        let d = await api.token(u);
        return d;
    }
}