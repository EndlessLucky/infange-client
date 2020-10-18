import React from 'react';
import Base from './Base';
import Inline from './InlineBase'
import Delete from '@material-ui/icons/Delete';


export default ({children, inline, ...props}) => {
    const Wrapper = inline ? Inline : Base;
    return (
        <Wrapper
            variant="fab"
            color="secondary"
            {...props}>
            <Delete/>
        </Wrapper>
    )
}

