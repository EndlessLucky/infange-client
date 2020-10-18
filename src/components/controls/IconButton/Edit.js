import React from 'react';
import Base from './Base';
import Inline from './InlineBase'
import Edit from '@material-ui/icons/Edit';


export default ({children, inline, ...props}) => {
    const Wrapper = inline ? Inline : Base;
    return (
        <Wrapper
            variant="fab"
            color="secondary"
            {...props}>
            <Edit/>
        </Wrapper>
    )
}

