import React from 'react';
import Base from './Base';
import Inline from './InlineBase'
import Add from '@material-ui/icons/Add';


export default ({children, inline, ...props}) => {
    const Wrapper = inline ? Inline : Base;
    return (
        <Wrapper
            variant="fab"
            color="secondary"
            {...props}>
            <Add/>
        </Wrapper>
    )
}

