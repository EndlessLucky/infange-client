import api from "../../helpers/api";
import storage from "../../helpers/storage";

const selectOrganization = (store) => (next) => async (action) => {
  next(action);
  const { payload } = action;
  console.log(action);

  switch (action.type) {
    case "SELECT_ORGANIZATION": {
      try {
        let users = await api.user.get(payload._id);
        users = users.data;
        next({
          type: "RECEIVE_USERS",
          payload: users,
        });

        let profile = users.find(
          (x) => x.clientID === storage.token.clientID.toString()
        );
        if (profile) {
          let id = profile._id;
          next({
            type: "RECEIVE_PROFILE_ID",
            payload: id,
          });
          api.objective.get().then((res) => {
            next({
              type: "RECEIVE_OBJECTIVES",
              payload: res.data,
            });
          });
          api.meeting.get().then((res) => {
            next({
              type: "RECEIVE_MEETINGS",
              payload: res.data,
            });
          });
          api.note.get().then((res) => {
            next({
              type: "RECEIVE_NOTES",
              payload: res.data,
            });
          });
        } else {
          next({
            type: "RECEIVE_OBJECTIVES",
            payload: [],
          });
          next({
            type: "RECEIVE_MEETINGS",
            payload: [],
          });
          next({
            type: "RECEIVE_ROLES",
            payload: [],
          });
          next({
            type: "RECEIVE_NOTES",
            payload: [],
          });
        }
      } catch (err) {
        console.error(err);
      }
      break;
    }
    case "RECEIVE_PROFILE_ID": {
      break;
    }
    default:
      break;
  }
};

export default selectOrganization;
