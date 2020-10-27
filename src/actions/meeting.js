import { meeting as api, invitee as inviteeAPI } from "../helpers/api";
import { getObjectives } from "../actions/objective";
import { receiveTopics } from "./topic";

export const receiveMeetings = (mtng) => {
  return {
    type: "RECEIVE_MEETINGS",
    payload: mtng,
  };
};

export const receiveInvitee = (invitees) => {
  return {
    type: "RECEIVE_INVITEE",
    payload: invitees,
  };
};

export const removeInvitee = (meetingID, inviteeID) => {
  return {
    type: "REMOVE_INVITEE",
    payload: { meetingID, inviteeID },
  };
};

export const updateInviteeStatus = (meetingID, inviteeID, requestStatus) => {
  return {
    type: "UPDATE_INVITEE",
    payload: { meetingID, inviteeID, requestStatus },
  };
};

export const updateMeeting = (mtng) => {
  return {
    type: "UPDATE_MEETING",
    payload: mtng,
  };
};

export const removeMeeting = (mtng) => {
  return {
    type: "REMOVE_MEETING",
    payload: mtng,
  };
};

export const getMeeting = (id) => {
  return async (dispatch) => {
    try {
      let m = await api.get(id);
      m = m.data;
      dispatch(receiveMeetings(m));
      return m;
    } catch (err) {
      console.error(err);
    }
  };
};

export const createMeeting = (meeting) => {
  return async (dispatch, getStore) => {
    try {
      let m = await api.create("", meeting);
      m = m.data;
      dispatch(
        receiveMeetings([m, ...Object.values(getStore().meetings.byID)])
      );
      return m;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const rescheduleMeeting = (oldMeetingId, meeting) => {
  return async (dispatch, getStore) => {
    try {
      let m = await api.create(oldMeetingId, meeting);
      m = m.data;
      dispatch(
        receiveMeetings([...Object.values(getStore().meetings.byID), m])
      );
      dispatch(getObjectives());
      return m;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const editMeeting = (mtng) => {
  console.warn(mtng);
  return async (dispatch) => {
    try {
      await api.update(mtng);
      dispatch(updateMeeting(mtng));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateMeetingTags = async (tags, mtngID, newTag = false) => {
  try {
    return await api.updateTags(tags, mtngID, newTag ? newTag : false);
  } catch (err) {
    let e = err.data ? err.data.message : err;
    console.error(e);
    throw e;
  }
};

export const deleteMeeting = (mtng) => {
  return async (dispatch) => {
    try {
      await api.remove(mtng);
      dispatch(removeMeeting(mtng));
    } catch (err) {
      if (err) {
        let e = err.data ? err.data.message || err.data : err;
        throw e;
      }
      throw new Error("Unable to delete");
    }
  };
};

export const createInvitee = (meetingID, invitee) => {
  return async (dispatch) => {
    try {
      let t = await inviteeAPI.create(meetingID, invitee);
      t = t.data;
      dispatch(receiveInvitee(t));
      return t;
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const deleteInvitee = (meetingID, InviteeID) => {
  return async (dispatch) => {
    try {
      await inviteeAPI.remove(meetingID, InviteeID);
      dispatch(removeInvitee(meetingID, InviteeID));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateInvitee = (meetingID, InviteeID, requestStatus) => {
  return async (dispatch) => {
    try {
      const m = await inviteeAPI.updateStatus(
        meetingID,
        InviteeID,
        requestStatus
      );
      dispatch(updateInviteeStatus(meetingID, InviteeID, requestStatus));
      dispatch(updateMeeting(m.data));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateMeetingEndConfirm = (meetingID, InviteeID, isAgreed) => {
  return async (dispatch) => {
    try {
      const m = await inviteeAPI.confirmMeetingEnd(
        meetingID,
        InviteeID,
        isAgreed
      );
      // dispatch(updateInviteeStatus(meetingID, InviteeID, requestStatus));
      dispatch(updateMeeting(m.data));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};

export const updateMeetingNotes = (meetingID, InviteeID, isAgreed) => {
  return async (dispatch) => {
    try {
      const m = await inviteeAPI.agreeMeetingNotes(
        meetingID,
        InviteeID,
        isAgreed
      );
      // dispatch(updateInviteeStatus(meetingID, InviteeID, requestStatus));
      dispatch(updateMeeting(m.data));
    } catch (err) {
      let e = err.data ? err.data.message : err;
      console.error(e);
      throw e;
    }
  };
};
