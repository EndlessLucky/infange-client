import { combineReducers } from 'redux'
import departments from './departments';
import objectives from './objectives';
import notes from './notes';
import users from './users';
import organizationID from './organizationID';
import meetings from './meetings';
import topics from './topics';
import supportingItems from './supportingItems';
import profiles from './profiles';
import globalSearch from './globalSearch';
import notifications from './notifications';

export default combineReducers({
    profiles, departments, objectives, users, meetings, topics, notifications, supportingItems, notes, organizationID, globalSearch
});