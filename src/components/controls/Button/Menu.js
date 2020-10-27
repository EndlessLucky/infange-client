import React, {Component} from 'react'
import IconButton from './Icon';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';

class MenuButton extends Component {
    state = {open: false, anchorEl: null};
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget, open: true });
    };

    handleClose = () => {
        this.setState({ anchorEl: null, open: false });
    };

    render() {
        const {open, anchorEl} = this.state;
        const {id, color = "inherit", children, icon} = this.props;

        return [
            <IconButton
                key={`${id}-button`}
                aria-owns={open ? id : null}
                aria-haspopup="true"
                onClick={this.handleMenu}
                color={color}
                >
                {icon}
            </IconButton>,
            <Menu
                id={id}
                key={id}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={this.handleClose}
                onClick={this.handleClose}
                >

                {children}
            </Menu>
        ]
    };
}

export default MenuButton;