import { note as api } from "../helpers/api";

export const receiveNotes = (note) => {
  return {
    type: "RECEIVE_NOTES",
    payload: note,
  };
};

export const updateNote = (note) => {
  return {
    type: "UPDATE_NOTE",
    payload: note,
  };
};

export const removeNote = (note) => {
  return {
    type: "REMOVE_NOTE",
    payload: note,
  };
};

export const getNote = (id) => {
  return async (dispatch) => {
    try {
      let n = await api.get(id);
      n = n.data;
      dispatch(receiveNotes(n));
      return n;
    } catch (err) {
      console.error(err);
    }
  };
};

export const createNote = (note) => {
  return async (dispatch, getStore) => {
    try {
      let n = await api.create(note);
      n = n.data;
      dispatch(receiveNotes([...Object.values(getStore().notes.byID), n]));
      return n;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const editNote = (note) => {
  return async (dispatch) => {
    try {
      await api.update(note);
      dispatch(updateNote(note));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateNoteTags = async (tags, noteID, newTag = false) => {
  try {
    return await api.updateNoteTags(tags, noteID, newTag ? newTag : false);
  } catch (err) {
    let e = err.data ? err.data.message : err;
    console.error(e);
    throw e;
  }
};

export const deleteNote = (note) => {
  return async (dispatch) => {
    try {
      await api.remove(note);
      dispatch(removeNote(note));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const getFolders = async (
  userID,
  orgID = "5b2a63078f565c741c141482"
) => {
  // default orgID
  try {
    return await api.fetchFolders(orgID, userID);
  } catch (err) {
    let e = err.data ? err.data.message : err;
    console.error(e);
    throw e;
  }
};

export const createFolder = async (
  userID,
  name,
  orgID = "5b2a63078f565c741c141482"
) => {
  // default orgID
  try {
    return await api.createFolder(name, orgID, userID);
  } catch (err) {
    let e = err.data ? err.data.message : err;
    console.error(e);
    throw e;
  }
};
