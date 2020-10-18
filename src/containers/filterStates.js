let meetingFilters = {
  myMeetings: false,
  pending: true,
  cancelled: true,
  inProgress: true,
  ended: true,
  missed: true,
  owners: [],
  invitees: [],
  tagState: [],
};

let objectiveFilters = {
  myObjectives: false,
  completed: true,
  inProgress: true,
  pending: true,
  owners: [],
  assignees: [],
  tagState: [],
};

let Meetings = {
  saveFilterList: function (state) {
    meetingFilters = state;
  },
  getFilterList: function () {
    return meetingFilters;
  },
};

let Objectives = {
  saveFilterList: function (state) {
    objectiveFilters = state;
  },
  getFilterList: function () {
    return objectiveFilters;
  },
};

module.exports = {
  Meetings,
  Objectives,
};
