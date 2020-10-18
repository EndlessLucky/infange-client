import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    flex: {
        display: 'flex',
        width: 450,
        maxWidth: '100%',
        flexFlow: 'row wrap',
        position: 'relative',
        
        '& > *': {
            width: '100%',
            flexBasis: '100%',
            flex: 1,
        }
    }
}

const Box = ({children, classes, ...props}) => (
    <div className={classes.flex} {...props}>
        {children}
    </div>
)

export default withStyles(styles)(Box);