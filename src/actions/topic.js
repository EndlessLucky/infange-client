import { topic as api } from "../helpers/api";

export const receiveTopics = (meetingID, tpc) => {
  return {
    type: "RECEIVE_TOPICS",
    payload: { meetingID, topics: tpc }
  };
};

export const receiveTopic = tpc => {
  return {
    type: "RECEIVE_TOPIC",
    payload: tpc
  };
};

export const updateTopic = (meetingID, topicID, topic) => {
  return {
    type: "UPDATE_TOPIC",
    payload: { _id: topicID, meetingID, ...topic }
  };
};

export const removeTopic = (meetingID, topicID) => {
  return {
    type: "REMOVE_TOPIC",
    payload: { meetingID, topicID }
  };
};

export const getTopics = meetingID => {
  return async dispatch => {
    try {
      let t = await api.get(meetingID);
      dispatch(receiveTopics(meetingID, t.data));
      return t;
    } catch (err) {
      console.error(err);
    }
  };
};

export const createTopic = (meetingID, topic, ordering = false) => {
  if (!ordering)
    return async dispatch => {
      try {
        let t = await api.create(meetingID, topic);
        t = t.data;
        // console.log("API sucess");
        dispatch(receiveTopic(t));
        return t;
      } catch (err) {
        let e = err.data ? err.data.message : err;
        console.error(e);
        throw e;
      }
    };
  else {
    const value = async () => {
      let t = await api.create(meetingID, topic);
      t = t.data;
      return t;
    };
    return value();
  }
};

export const editTopic = (meetingID, topicID, updated) => {
  return async dispatch => {
    try {
      let ops = [];
      for (let k in updated) {
        if (updated.hasOwnProperty(k)) {
          ops.push({ op: "replace", path: k, value: updated[k] });
        }
      }
      await api.update(meetingID, topicID, ops);
      dispatch(updateTopic(meetingID, topicID, updated));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const deleteTopic = (meetingID, topicID) => {
  return async dispatch => {
    try {
      await api.remove(meetingID, topicID);
      dispatch(removeTopic(meetingID, topicID));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};
