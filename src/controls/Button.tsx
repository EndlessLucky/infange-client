import React from 'react';
import {Button as MuiButton, ButtonProps} from "@material-ui/core";
import Loading from "./Loading";
import {makeStyles} from "@material-ui/core/styles";
import clsx from 'clsx';

const useLocalStyles = makeStyles(theme => ({
    root: {
        position: 'relative'
    },
}));

type Props = ButtonProps & {
    loading?: boolean
}

const Button: React.FC<Props> = ({loading, className, children, disabled, ...props}) => {
    const classes = useLocalStyles();

    return <MuiButton {...props} disabled={disabled || loading} className={clsx(classes.root, className)}>
        {children}{loading && <Loading size={24} />}
    </MuiButton>
}

export default Button;