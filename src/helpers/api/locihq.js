import axios from "axios";
import Storage from "../storage";

// locihq

/**
 *
 * @param username
 * @param password
 * @returns {Promise<{token, refreshToken}>}
 */
export async function login({ username, password }) {
  return axios.post("/api/Login", { username, password }).then(response => {
    const { token, refreshToken } = response.data;
    Storage.token.access = token;
    Storage.token.refresh = refreshToken;
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    return { token, refreshToken };
  });
}

export async function resendRequest({ username }) {
  return axios.get(`/api/resend?username=${username}`).then(response => {
    return response.data;
  });
}
/**
 *
 * @param userID
 * @returns {Promise<AxiosPromise<any>>}
 */
export async function token() {
  return axios.post("/api/Token", {
    userID: Storage.token.clientID,
    refreshToken: Storage.token.refresh
  });
}

export async function newAccount(client) {
  return axios.post("/api/newAccount", client);
}

export async function resetpwd(body, param) {
  return axios.post(`/api/reset/${param}`, body);
}

export async function resetpwdreq(param) {
  return axios.get(`/api/reset?${param}`);
}

export async function createAccount(client) {
  return axios.post("/api/createAccount", client);
}
