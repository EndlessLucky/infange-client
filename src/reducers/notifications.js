const reducer = (state = {}, action) => {
  switch (action.type) {
    case "RECEIVE_NOTIFICATIONS": {
      const { payload } = action;
      return payload.notifications;
    }
    case "RECEIVE_NOTIFICATION": {
      const { payload } = action;
      return [...state, { payload }];
    }
    case "REMOVE_NOTIFICATION": {
      const { payload } = action;
      let p = state.map((n) => {
        if (n._id === payload._id) return { ...n, trash: true, read: true };
        else return n;
      });

      p.sort(function (a, b) {
        if ((!a.trash && b.trash) || a.trash === b.trash) return -1;
        else return 1;
      });
      p.sort(function (a, b) {
        if (a.trash != b.trash || a.createDate <= b.createDate) return 1;
        else return -1;
      });
      return p;
    }
    case "READ_NOTIFICATION": {
      const { payload } = action;
      const newState = [...state];

      const n = newState.find((n) => n._id === payload._id);

      if (n) n.read = true;

      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
