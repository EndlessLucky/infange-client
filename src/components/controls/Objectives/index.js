import React from 'react';
import ObjectivesIcon from '@material-ui/icons/AssignmentTurnedIn';

const Objectives = ({children, classes, ...props}) => {
    return (
        <div {...props}>
            <ObjectivesIcon />
        </div>
    )
}

export default Objectives;

