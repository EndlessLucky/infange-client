import {login, token, newAccount} from '../helpers/api';

export const createAccount = client => {
    return async function(dispatch) {
        try {
            let d = await newAccount(client);
            d = d.data;
            return d;
        }
        catch(err) {
            let e = err.data ? err.data.message : err
            console.error(e);
            throw e;
        }

    }
}