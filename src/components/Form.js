import React from 'react';

const handleEnter = (e) => {
    e.preventDefault();
    return false;
}

export default ({children, ...props}) => (
    <form onSubmit={handleEnter} {...props}>
        {children}
    </form>
)