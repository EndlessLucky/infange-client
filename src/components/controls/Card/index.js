import React from 'react';
import {CardHeader, CardContent, Card} from '@material-ui/core';

export default (props) => (
    <Card {...props} />
)

//title, subHeader, onEditClick, text, action
export const ActionCard = ({content, title, action, ...props}) => {
    return (
        <Card style={{boxShadow: 'none'}} {...props} >
            <CardHeader
                title={title}
                action={action}
            />
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}