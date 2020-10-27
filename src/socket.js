import io from "socket.io-client";
import { NotificationManager } from "react-notifications";
import store from "./store";
import { getNotifications } from "./actions/notification";
import { getObjectives } from "./actions/objective";
import { getMeeting } from "./actions/meeting";
import { getTopics } from "./actions/topic";

const socketClient = io("/", {
  path: "/socket",
});

export const getSocketInstance = () => {
  return socketClient;
};

const updateData = (n) => {
  store.dispatch(getObjectives());
  store.dispatch(getMeeting());
  store.dispatch(getTopics(n));
};

const insertNotification = (n) => {
  const userId = JSON.parse(localStorage.profiles)[0]._id;
  store.dispatch(getNotifications(userId));
  updateData();
};

export const registerNotifications = (history) => {
  socketClient.on("connect", function () {});

  socketClient.on("objective_updated", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000, () => {
      history.push({
        pathname: "/objectives",
        search: "",
        state: { selectedObj: payload.id },
      });
    });
  });

  socketClient.on("objective_reminder", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000, () => {
      history.push({
        pathname: "/objectives",
        search: "",
        state: { selectedObj: payload.id },
      });
    });
  });

  socketClient.on("notification_deleted", (payload) => {
    NotificationManager.error(payload.message, null, 3000);
  });

  socketClient.on("objective_deleted", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000);
  });

  socketClient.on("meeting_created", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000, () => {
      history.push({
        pathname: `/Meetings`,
        search: "",
        state: { selectedMtng: payload.id },
      });
    });
  });

  socketClient.on("meeting_reminder", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000, () => {
      history.push({
        pathname: `/Meetings`,
        search: "",
        state: { selectedMtng: payload.id },
      });
    });
  });

  socketClient.on("meeting_invite_removed", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message);
  });

  socketClient.on("meeting_invite_accepted", (payload) => {
    insertNotification(payload);
    NotificationManager.info(payload.message, null, 3000, () => {
      history.push({
        pathname: `/Meetings`,
        search: "",
        state: { selectedMtng: payload.id },
      });
    });
  });

  socketClient.on("update_data", (payload) => {
    updateData(payload.id);
  });
};
