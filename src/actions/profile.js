import { avatar as api } from "../helpers/api";

export const receiveAvatar = (a) => {
  return {
    type: "RECEIVE_AVATAR",
    payload: a,
  };
};

// This gets its info from our token.data
export const receiveProfiles = (p) => {
  return {
    type: "RECEIVE_PROFILES",
    payload: p,
  };
};

export const createAvatar = (orgID, image) => {
  return async (dispatch, getStore) => {
    try {
      let data = new FormData();
      data.append("file", image);
      data.append("name", "Avatar");
      let m = await api.create(orgID, data);
      m = m.data;
      // console.log('avatar:',m);
      return m;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};
