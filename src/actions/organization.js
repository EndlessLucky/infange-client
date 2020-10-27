import {organization as api} from '../helpers/api';

export const requestOrganizations = () => {
    return {
        type: 'REQUEST_ORGANIZATIONS'
    }
};

export const selectOrganization = (org) => {
    return {
        type: 'SELECT_ORGANIZATION',
        payload: org
    }
}


export const receiveOrganizations = (orgs) => {
    return {
        type: 'RECEIVE_ORGANIZATIONS',
        payload: orgs
    }
}

export const activeOrganization = (org) => {
    return async (dispatch) => {
        try {
            dispatch(selectOrganization(org));

        }
        catch(err) {
            console.error(err);
        }
    }
}

export const getOrganization = (id) => {
    return async (dispatch,getState) => {
        try {
            let org = getState().organizations;
            if((!id && !org.allIDs.length) || (id && !org.byID[id])) {
                let d = await api.get(id);
                d = d.data;
                dispatch(receiveOrganizations(d));

                //TODO: trigger this only on the active organization
                //d.forEach(x => dispatch(getUsers(x._id)));
                return d;
            }
            return org;
        }
        catch(err) {
            console.error(err);
        }
    }
}

export const createOrganization = (organization) => {
    return async (dispatch, getStore) => {
        try {
            let d = await api.create(organization);

            d = d.data;

            dispatch(receiveOrganizations([d]));
            return d;
        }
        catch(err) {
            let e = err.data ? err.data.message : err;
            console.error(e);
            throw e;
        }

    }
}