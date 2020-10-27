import { user as api, avatar as avatarApi } from "../helpers/api";

export const requestUsers = () => {
  return {
    type: "REQUEST_USERS"
  };
};

export const receiveUsers = users => {
  return {
    type: "RECEIVE_USERS",
    payload: users
  };
};

export const updateUser = user => {
  return {
    type: "UPDATE_USER",
    payload: user
  };
};

export const removeUser = user => {
  return {
    type: "REMOVE_USER",
    payload: user
  };
};

export const getUsers = () => {
  return async dispatch => {
    try {
      let d = await api.get();
      d = d.data;

      dispatch(receiveUsers(d));
      return d;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const getAvatars = organizationID => {
  return async dispatch => {
    try {
      let d = await avatarApi.get(organizationID);
      d = d.data;
    //  console.log(d);
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const createUser = user => {
  return async (dispatch, getStore) => {
    try {
      let u = await api.create(user);
      u = u.data;
      dispatch(receiveUsers([...Object.values(getStore().users.byID), u]));
      return u;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const editUser = user => {
  return async dispatch => {
    try {
      await api.update(user);
      dispatch(updateUser(user));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const deleteUser = user => {
  return async dispatch => {
    try {
      await api.remove(user);
      dispatch(removeUser(user));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};
