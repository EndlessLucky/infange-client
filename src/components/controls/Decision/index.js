import React from 'react';
import DecisionIcon from '@material-ui/icons/Person';

const Decision = ({children, classes, ...props}) => {
    return (
        <span {...props}>
            <DecisionIcon />
        </span>
    )
}

export default Decision;