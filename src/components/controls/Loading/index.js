
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    root: {
        position: 'relative',
        display:'inline-block',
    }
});

const Load = withStyles(styles)(({size=20, color, ...props}) => (
        <CircularProgress
            size={size}
            color="secondary"
            style={{color: color ? color : null}} 
            {...props}
        />
));

export default Load;