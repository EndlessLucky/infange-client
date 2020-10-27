import React from 'react';
import ErrorIcon from '@material-ui/icons/ErrorOutline';

export const Error = ({children}) => (
    <div style={{margin: '20px 0', color: '#f44336'}}>
        <ErrorIcon /> {children}
    </div>
)