import React from 'react';
import { withStyles} from '@material-ui/core/styles';

const styles = {
    list: {
        width: '100%',
        display: 'flex'
    },
    listItem: {
        borderBottom: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        textAlign: 'left',
        justifyContent: 'space-between'
    }
}


const List = withStyles(styles)(({children, classes, className = '', ...props}) => {
    const c = `${classes.list} ${className}`
    return (
        <div className={c} {...props}>
            {children}
        </div>
    )
})

const ListItem = withStyles(styles)(({children, classes, className = '', ...props}) => {
    const c = `${classes.listItem} ${className}`
    return (
        <div className={c} {...props}>
            {children}
        </div>
    )
})

export {
    List, ListItem
};

export default List;