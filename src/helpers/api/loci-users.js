import axios from "axios";

const HOST = "/api/account";

function url() {
  return HOST;
}

function organizationUrl(orgID) {
  if (orgID) {
    throw new Error(`${orgID} is not a valid ObjectId`);
  }
  return `${HOST}/organization${orgID ? `/${orgID}` : ""}`;
}

function departmentUrl(orgID, deptID) {
  if (deptID) {
    throw new Error(`${deptID} is not a valid ObjectId`);
  }
  return `${url(orgID)}/department${deptID ? `/${deptID}` : ""}`;
}

function userUrl(userID) {
  return `${HOST}/Users${userID ? `/${userID}` : ""}`;
}

function avatarUrl(orgID) {
  return `${url()}/${orgID}/Avatar`;
}

export const organization = {
  /**
   * Creates an organization
   * @param {object} organization: Object containing all the properties of an organization
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async organization => {
    return axios.post(organizationUrl(null), organization);
  },

  /**
   *
   * @param {ObjectId} [organizationID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async organizationID => {
    return axios.get(organizationUrl(organizationID));
  },

  /**
   * Updates the organization
   * @param {object} organization: Object containing all the properties of an organization
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async organization => {
    return axios.put(organizationUrl(organization._id), organization);
  },

  /**
   * Deletes an organization permanently
   * @param {object} organization
   * @returns {Promise<AxiosPromise>}
   */
  remove: async organization => {
    return axios.delete(organizationUrl(organization._id));
  }
};

export const department = {
  /**
   *
   * @param {object} department
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async department => {
    return axios.post(departmentUrl(department.organizationID), department);
  },

  /**
   *
   * @param {ObjectId} organizationID
   * @param {ObjectId} [departmentID]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (organizationID, departmentID) => {
    return axios.get(departmentUrl(organizationID, departmentID));
  },

  /**
   *
   * @param {object} department
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async department => {
    return axios.put(departmentUrl(department.organizationID, department._id));
  },

  /**
   *
   * @param {object} department
   * @returns {Promise<AxiosPromise>}
   */
  remove: async department => {
    return axios.delete(
      departmentUrl(department.organizationID, department._id)
    );
  }
};

export const user = {
  /**
   *
   * @param {object} user
   * @returns {Promise<AxiosPromise<any>>}
   */
  create: async user => {
    return axios.post(userUrl(), user);
  },

  /**
   *
   * @param {ObjectId} orgID
   * @param {ObjectId} [userID]
   * @param {Object} [params]
   * @returns {Promise<AxiosPromise<any>>}
   */
  get: async (userID, params = {}) => {
    return axios.get(userUrl(userID), { params });
  },

  /**
   *
   * @param {object} user
   * @returns {Promise<AxiosPromise<any>>}
   */
  update: async user => {
    return axios.put(userUrl(user._id), user);
  },

  /**
   *
   * @param {object} user
   * @returns {Promise<AxiosPromise>}
   */
  remove: async user => {
    return axios.delete(userUrl(user._id));
  }
};

export const avatar = {
  create: async (orgID, avatar) => {
    return axios.post(avatarUrl(orgID), avatar);
  },
  get: async orgID => {
    return axios.get(avatarUrl(orgID));
  }
};
