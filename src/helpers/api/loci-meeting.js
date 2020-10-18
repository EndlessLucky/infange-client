import axios from "axios";

const HOST = "/api";

function url() {
  return HOST;
}

function meetingUrl(meetingID) {
  return `${url()}/meetings${meetingID ? `/${meetingID}` : ""}`;
}

function meetingTagUrl(meetingID) {
  return `${url()}/meetings${meetingID ? `/${meetingID}` : ""}/tags`;
}

function topicUrl(meetingID, topicID) {
  return `${url()}/meetings/${meetingID}/agendas${
    topicID ? `/${topicID}` : ""
  }`;
}

function supportingItemUrl(meetingID, topicID, supportingItemID) {
  return `${url()}/meetings/${meetingID}/agendas/${topicID}/supportingItems${
    supportingItemID ? `/${supportingItemID}` : ""
  }`;
}

function inviteesUrl(meetingID, inviteeID) {
  return `${url()}/meetings/${meetingID}/invitees${
    inviteeID ? `/${inviteeID}` : ""
  }`;
}

function meetingEndConfirmUrl(meetingID, memberId) {
  return `${url()}/meetings/${meetingID}/members/${memberId}`;
}

function documentUrl(docID) {
  return `${url()}/document${docID ? `/${docID}` : ""}`;
}

export const meeting = {
  /**
   *
   * @param {object} meeting
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (oldMeetingId, meeting) => {
    return axios.post(meetingUrl(), { oldMeetingId, meeting });
    // create: async meeting => {
    //   return axios.post(meetingUrl(), meeting);
    // },
  },

  /**
   *
   * @param {ObjectId} [meetingID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (meetingID) => {
    return axios.get(meetingUrl(meetingID));
  },

  /**
   *
   * @param {object} meeting
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (meeting) => {
    return axios.put(meetingUrl(meeting._id), meeting);
  },

  /**
   *
   * @param {object} meeting
   * @returns {Promise<AxiosPromise<any>>}
   */
  updateTags: async (tags, meetingId, newTag = false) => {
    let body = { tags };
    if (newTag) body.newTag = newTag;
    return axios.patch(meetingTagUrl(meetingId), body);
  },

  /**
   *
   * @param {object} meeting
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (meeting) => {
    return axios.delete(meetingUrl(meeting._id));
  },
};

export const document = {
  /**
   *
   * @param {object} doc
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (doc) => {
    return axios.post(documentUrl(), doc);
  },

  /**
   *
   * @param {ObjectId} [docID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (docID) => {
    return axios.get(documentUrl(docID));
  },

  /**
   *
   * @param {object} doc
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (doc) => {
    return axios.patch(documentUrl(doc._id), doc);
  },

  /**
   *
   * @param {object} doc
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (doc) => {
    return axios.delete(documentUrl(doc._id));
  },
};

export const topic = {
  /**
   *
   * @param {object} topic
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (meetingID, topic) => {
    return axios.post(topicUrl(meetingID), topic);
  },

  /**
   *
   * @param {ObjectId} [meetingID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (meetingID) => {
    return axios.get(topicUrl(meetingID));
  },

  /**
   * This is a patch operation
   * @param {object} topic
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (meetingID, topicID, ops) => {
    return axios.patch(topicUrl(meetingID, topicID), ops);
  },

  /**
   *6
   * @param {object} topic
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (meetingID, topicID) => {
    return axios.delete(topicUrl(meetingID, topicID));
  },
};

export const supportingItem = {
  /**
   *
   * @param {object} supportingItem
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (meetingID, topicID, supportingItem) => {
    return axios.post(supportingItemUrl(meetingID, topicID), supportingItem);
  },

  /**
   *
   * @param {ObjectId} [topicID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (meetingID, topicID) => {
    return axios.get(supportingItemUrl(meetingID, topicID));
  },

  /**
   * This is a patch operation
   * @param {object} supportingItemID
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (meetingID, topicID, supportingItemID, sp) => {
    return axios.put(
      supportingItemUrl(meetingID, topicID, supportingItemID),
      sp
    );
  },

  /**
   *6
   * @param {object} _id
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (meetingID, topicID, _id) => {
    return axios.delete(supportingItemUrl(meetingID, topicID, _id));
  },
};

export const invitee = {
  /**
   *
   * @param {object} invitees
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (meetingID, newInvitees) => {
    return axios.post(inviteesUrl(meetingID), newInvitees);
  },

  /**
   *
   * @param {object} invitees
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (meetingID, inviteeID) => {
    return axios.delete(inviteesUrl(meetingID, inviteeID));
  },

  /**
   *
   * @param {object} invitees
   * @returns {Promise<AxiosPromise>}
   */
  updateStatus: async (meetingID, inviteeID, requestStatus) => {
    return axios.patch(inviteesUrl(meetingID, inviteeID), { requestStatus });
  },
  /**
   *
   * @param {object} invitees
   * @returns {Promise<AxiosPromise>}
   */
  confirmMeetingEnd: async (meetingID, inviteeID, isAgreed) => {
    return axios.put(
      `${meetingEndConfirmUrl(meetingID, inviteeID)}/isMeetingEndAgreed`,
      { isAgreed }
    );
  },
  /**
   *
   * @param {object} invitees
   * @returns {Promise<AxiosPromise>}
   */
  agreeMeetingNotes: async (meetingID, inviteeID, isAgreed) => {
    return axios.put(`${meetingEndConfirmUrl(meetingID, inviteeID)}/isagreed`, {
      isAgreed,
    });
  },
};
