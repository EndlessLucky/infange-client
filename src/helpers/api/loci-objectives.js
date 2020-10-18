import axios from "axios";

const HOST = "/api";

function url() {
  return HOST;
}

function objectiveUrl(objID) {
  return `${url()}/objectives${objID ? `/${objID}` : ""}`;
}

function objectiveTagUrl(objID) {
  return `${url()}/objectives${objID ? `/${objID}` : ""}/tags`;
}

function noteUrl(noteID) {
  return `${url()}/notes${noteID ? `/${noteID}` : ""}`;
}

function noteTagUrl(noteID) {
  return `${url()}/notes${noteID ? `/${noteID}` : ""}/tags`;
}

function fetchFolderUrl(orgID, userID) {
  return `${url()}/notes/folders/${orgID}/user/${userID}`;
}

function createFolderUrl(name, orgID, userID) {
  return `${url()}/notes/folders/${orgID}/user/${userID}/?name=${name}`;
}

export const objective = {
  /**
   *
   * @param {object} objective
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (objective) => {
    return axios.post(objectiveUrl(), objective);
  },

  /**
   * @param {ObjectId} [objID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (objID) => {
    return axios.get(objectiveUrl(objID));
  },

  /**
   *
   * @param {object} objective
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (objective) => {
    return axios.put(objectiveUrl(objective._id), objective);
  },

  /**
   *
   * @param {object} objective
   * @returns {Promise<AxiosPromise<any>>}
   */
  updateTags: async (tags, objId, newTag = false) => {
    let body = { tags };
    if (newTag) body.newTag = newTag;
    return axios.patch(objectiveTagUrl(objId), body);
  },

  /**
   *
   * @param {object} objective
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (objective) => {
    return axios.delete(objectiveUrl(objective._id));
  },
};

export const note = {
  /**
   *
   * @param {object} note
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async (note) => {
    return axios.post(noteUrl(), note);
  },

  /**
   * @param {ObjectId} [noteID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (noteID) => {
    return axios.get(noteUrl(noteID));
  },

  /**
   *
   * @param {object} note
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async (note) => {
    return axios.put(noteUrl(note._id), note);
  },

  /**
   *
   * @param {object} note
   * @returns {Promise<AxiosPromise<any>>}
   */
  updateNoteTags: async (tags, noteID, newTag = false) => {
    let body = { tags };
    if (newTag) body.newTag = newTag;
    return axios.patch(noteTagUrl(noteID), body);
  },

  /**
   *
   * @param {object} note
   * @returns {Promise<AxiosPromise>}
   */
  remove: async (note) => {
    return axios.delete(noteUrl(note._id));
  },

  /**
   *
   * @returns {Promise<AxiosPromise<any>>}
   */
  fetchFolders: async (orgID, userID) => {
    return axios.get(fetchFolderUrl(orgID, userID));
  },

  /**
   *
   * @returns {Promise<AxiosPromise<any>>}
   */
  createFolder: async (name, orgID, userID) => {
    return axios.post(createFolderUrl(name, orgID, userID));
  },
};
