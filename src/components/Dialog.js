import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const MyDialog = ({open, title, message, actionContent, children}) => {
    let render = children;
    if(title || message || actionContent) {
        render = (
            <>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {actionContent}
                </DialogActions>
            </>
        )
    }
    return (
        <Dialog open={open}>
            {render}
        </Dialog>
    )
}

export default MyDialog;