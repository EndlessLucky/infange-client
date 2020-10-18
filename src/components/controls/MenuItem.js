import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const styles = theme => ({
    menuItem: {
        // '&:focus': {
        //     backgroundColor: theme.palette.primary.main,
        //     '& $primary, & $icon': {
        //         color: theme.palette.common.white,
        //     },
        // },
    },
    primary: {},
    icon: {},
});

const MyMenuItem = ({classes, children, primary, secondary, ...props}) => (
    <MenuItem className={classes.menuItem} {...props}>
        {children}
        {primary || secondary ? <ListItemText classes={{ primary: classes.primary }} inset primary={primary} secondary={secondary} /> : null}
    </MenuItem>
);

const MyMenuItemIcon = ({classes, children}) => (
    <ListItemIcon className={classes.icon}>
        {children}
    </ListItemIcon>
)

export const MenuItemIcon = withStyles(styles)(MyMenuItemIcon);

export default withStyles(styles)(MyMenuItem);