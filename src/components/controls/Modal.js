import React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import {withStyles} from "@material-ui/core/styles";
import {Toolbar} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Slide from "@material-ui/core/Slide";
import CloseIcon from "@material-ui/icons/Close";
import {IconButton} from "../../components/controls/Button";

const styles = (theme) => ({
    appBar: {
        position: "relative",
    },
    title: {
        color: "white",
    },
    dTitle: {
        padding: "0 0 0 20px",
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

const Transition = React.forwardRef((props, r) => (
    <Slide direction="up" {...props} ref={r}/>
));

const MyModal = ({children, classes, title, onClose, ...props}) => {
    return (
        <Dialog TransitionComponent={Transition} maxWidth={'md'} PaperProps={{style: {margin: 8}}} {...props}>
            <AppBar className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <DialogTitle className={classes.dTitle} style={{float: "center"}}>
                        <span className={classes.title}>{title}</span>
                    </DialogTitle>
                    <IconButton onClick={onClose} className={classes.title}>
                        <CloseIcon/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    );
};

export default withStyles(styles)(MyModal);
