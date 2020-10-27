import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import TextBox from '../../../../components/controls/TextBox';
import {IconButton, MenuButton} from '../../../../components/controls/Button';
import {SaveButton} from '../../../../components/controls/Button';
import {editSupportingItem} from "../../../../actions/supportingItem";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
    icon: {
        color: 'dimgrey',
        marginRight: '30px',
        marginTop: '5px'
    }
})

const Editable = ({children, onEditClick, onDeleteClick, canEdit = true, canDelete = true, icons}) => (
    <Fragment>
        {!icons ? <span>
            {canEdit && <IconButton onClick={onEditClick}> <EditIcon /> </IconButton>}
            {canDelete && <IconButton onClick={onDeleteClick}> <DeleteIcon /> </IconButton>}
        </span>
        : icons}
    </Fragment>
)

const LinkField = ({topicID, _id, link, type, ownerID, meetingID, update, canEdit, canDelete = true, onDeleteClick}) => {

    const [edit, setEdit] = useState(canEdit === null ? null : false);
    const [sLink, setLink] = useState(link);
    const [pending, setPending] = useState(false);
    const classes = useStyles(); 

    const NavigateTo = props => <RouterLink to="" {...props} />

    function onEditClick() {
        setEdit(true);
        setLink(link);
    }

    async function editLink() {
        try {
            setPending(true);
            let updated = {};
            if(link !== sLink) updated.link = sLink;
            await update(meetingID, topicID, _id, type, ownerID, updated);
            setEdit(false);
        }
        catch(err) {
            console.warn(err);
        }
        setPending(false);
    }

    return (
        <Fragment>
            <div>
                {edit ? 
                    <Fragment>
                        <LinkIcon />                        
                        <div>
                            <TextBox label="Link" name="link" inputProps={{maxLength: 30}} value={sLink} onChange={(e) => setLink(e.target.value)} />
                            <SaveButton color="primary" isLoading={pending} onClick={editLink} />
                        </div>
                    </Fragment>
                :
                    <Fragment>
                        <LinkIcon className={classes.icon} /> <Link component={NavigateTo}> {link} </Link> 
                        <span>
                            <Editable canEdit={edit === null} onEditClick={edit === null ? () => {} : onEditClick} 
                                    canDelete={canDelete} onDeleteClick={onDeleteClick}
                            icons={ 
                                <Fragment>
                                    <IconButton onClick={onEditClick}> <EditIcon /> </IconButton>
                                    <IconButton onClick={onDeleteClick}> <DeleteIcon /> </IconButton>
                                </Fragment> 
                                } 
                            />
                        </span>                   
                    </Fragment>
                }
            </div>
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    update: (mID, id, suptngItem, updated) => dispatch(editSupportingItem(mID, id, suptngItem, updated)) 
})

export default connect(null, mapDispatchToProps)(LinkField);