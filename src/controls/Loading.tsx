import React from 'react';
import CircularLoading, {CircularProgressProps} from '@material-ui/core/CircularProgress';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        textAlign: 'center',
    },
    icon: {
        color: 'inherit',
        fontSize: 150
    }
}));

type Props = CircularProgressProps;

const Loading: React.FC<Props> = ({color = 'primary', size = 36, ...props}) => {
    const classes = useStyles();
    return (
        <div className={classes.root} style={{marginTop: -size/2, marginLeft: -size/2}}>
            <CircularLoading color={color} size={size} {...props}  />
        </div>
    )
}

export default Loading;
