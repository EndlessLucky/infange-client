import React from "react";
import BaseButton from "./Base";
import Delete from "@material-ui/icons/Delete";
import { withStyles } from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import clsx from "clsx";

const styles = theme => ({
    button: {
        margin: theme.spacing(1)
    },
    wrapper: {
        paddingTop: theme.spacing(1)
    },
    leftIcon: {
        marginRight: theme.spacing(1)
    },
    rightIcon: {
        marginLeft: theme.spacing(1)
    },
    iconSmall: {
        fontSize: 20
    },
    delete: {
        color: theme.palette.getContrastText(red[700]),
        backgroundColor: red[700],
        '&:hover': {
            backgroundColor: red[900],
        }
    }
});

const SaveButton = ({ children, classes, className, ...props }) => {
    return (
        <div className={classes.wrapper}>
            <BaseButton variant="contained" className={clsx(classes.delete, className)} {...props}>
                <Delete className={clsx(classes.leftIcon, classes.iconSmall)} />{" "}
                Delete
            </BaseButton>
        </div>
    );
};

export default withStyles(styles)(SaveButton);