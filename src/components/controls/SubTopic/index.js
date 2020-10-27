import React from 'react';
import SubTopicIcon from '@material-ui/icons/NoteAdd';

const SubTopic = ({children, classes, ...props}) => {
    return (
        <span {...props}>
            <SubTopicIcon />
        </span>
    )
}

export default SubTopic;