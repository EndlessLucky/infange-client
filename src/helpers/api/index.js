import {
  login,
  token,
  newAccount,
  resendRequest,
  resetpwd,
  resetpwdreq
} from "./locihq";
import axios from "axios";
import storage from "../storage";

// Ajax wrappers
import { organization, department, user, avatar } from "./loci-users";
import {
  document,
  meeting,
  topic,
  supportingItem,
  invitee
} from "./loci-meeting";
import { objective, note } from "./loci-objectives";
import { notification } from "./loci-notifications";

let tokenData = null;
if (storage.token.access) {
  try {
    tokenData = JSON.parse(window.atob(storage.token.access.split(".")[1]));
  } catch (err) {
    console.warn(err);
  }
}

async function getToken() {
  let d = await token();
  storage.token.access = d.data.token;
  axios.defaults.headers.common["Authorization"] = "Bearer " + d.data.token;
  return storage.token.access;
}
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + storage.token.access;
//
// axios.interceptors.request.use(async config => {
//     if(storage.token.userID && new Date(tokenData.exp * 1000 + 1000) < new Date()
//         && config.url.toLowerCase() !== '/api/token') {
//         let token = await getToken();
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

axios.interceptors.response.use(
  res => {
    return res;
  },
  async error => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      window.location = "/Login";
      // originalRequest.url.toLowerCase() !== '/api/token') {
      // originalRequest._retry = true;
      // let token = await getToken();
      // originalRequest.headers['Authorization'] = 'Bearer ' + token;
      // return axios(originalRequest);
    } else {
      throw error.response;
    }
  }
);

export default {
  login,
  token,
  newAccount,
  organization,
  department,
  document,
  meeting,
  topic,
  supportingItem,
  objective,
  note,
  user,
  avatar,
  notification,
  resendRequest,
  resetpwd,
  resetpwdreq
};

export {
  login,
  token,
  newAccount,
  organization,
  department,
  document,
  meeting,
  topic,
  supportingItem,
  objective,
  note,
  user,
  avatar,
  invitee,
  notification,
  resendRequest,
  resetpwd,
  resetpwdreq
};
