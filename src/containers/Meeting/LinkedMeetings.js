import React from "react";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { history } from "../../store";

const LinkedMeetings = ({ meetings, onClose }) => {
  return (<div style={{minWidth: 200}}>
    <List 
      component="nav"
      style={{ maxHeight: 500 }}
      subheader={
        <ListSubheader component="div" style={{ backgroundColor: '#fff' }}>
          Linked Meetings
        </ListSubheader>
      }>
      {meetings.map(meeting => 
        (<div onClick={() => { onClose(); history.push(`/Meetings/${meeting._id}`); }}>
          <ListItem button>
            <ListItemText primary={meeting.title} />
          </ListItem>
        </div>)
      )
      }
    </List>
  </div>)
};


export default LinkedMeetings;
