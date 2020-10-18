import React, { PureComponent } from 'react';
import {Menu} from '@material-ui/core';
import { IconButton } from '@material-ui/core';

class MoreVert extends PureComponent {  
    state = {
        anchorEl: null
    }

    handleClose = () => {
        this.setState({ anchorEl: null })
    }

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    render() {  
        const { address, onChange } = this.props;        
        const {anchorEl} = this.state;

        const open = Boolean(anchorEl);

        const ITEM_HEIGHT = 48;

        return (     
            <IconButton onClick={this.handleClick}>
                 <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    PaperProps={{
                        style: {
                        maxHeight: ITEM_HEIGHT * 4.5
                        },
                    }}
                >
                </Menu>
            </IconButton>
        );
    }
}

export default MoreVert;