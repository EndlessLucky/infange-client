import { objective as api } from "../helpers/api";

export const requestObjectives = () => {
  return {
    type: "REQUEST_OBJECTIVES"
  };
};

export const receiveObjectives = objectives => {
  return {
    type: "RECEIVE_OBJECTIVES",
    payload: objectives
  };
};

export const updateObjective = objective => {
  return {
    type: "UPDATE_OBJECTIVE",
    payload: objective
  };
};

export const removeObjective = objective => {
  return {
    type: "REMOVE_OBJECTIVE",
    payload: objective
  };
};

export const getObjectives = id => {
  return async dispatch => {
    try {
      let o = await api.get(id);
      o = o.data;
      dispatch(receiveObjectives(o));
      return o;
    } catch (err) {
      console.error(err.data.message);
      throw err.data.message;
    }
  };
};

export const createObjective = objective => {
  return async (dispatch, getStore) => {
    try {
      let o = await api.create(objective);
      o = o.data;
      dispatch(
        receiveObjectives([...Object.values(getStore().objectives.byID), o])
      );
      return o;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const editObjective = objective => {
  return async dispatch => {
    try {
      await api.update(objective);
      dispatch(updateObjective(objective));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateObjTags = async (tags, objID, newTag = false) => {
  try {
    return await api.updateTags(tags, objID, newTag ? newTag : false);
  } catch (err) {
    let e = err.data ? err.data.message : err;
    console.error(e);
    throw e;
  }
};
export const deleteObjective = objective => {
  return async dispatch => {
    try {
      await api.remove(objective);
      dispatch(removeObjective(objective));
    } catch (err) {
      if (err) {
        let e = err.data ? err.data.message || err.data : err;
        console.error(e);
        throw e;
      }
      throw new Error("Unable to delete");
    }
  };
};
