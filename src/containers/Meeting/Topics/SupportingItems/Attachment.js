import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import AttachmentIcon from '@material-ui/icons/Attachment';
import {IconButton} from '../../../../components/controls/Button';
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

const Attachment = ({meetingID, topicID, _id, attachment, type, ownerID, update, canEdit, canDelete = true, onDeleteClick, ...props}) => {

    const [edit, setEdit] = useState(canEdit === null ? null : false);
    const [sAttachment, setAttachment] = useState(attachment);
    const [pending, setPending] = useState(false);
    const classes = useStyles(); 

    const NavigateTo = props => <RouterLink to="" {...props} />

    function onEditClick() {
        setEdit(true);
        setAttachment(attachment);
    }

    async function editAttachment() {
        try {
            setPending(true);
            let updated = {};
            if(attachment !== sAttachment) updated.attachment = sAttachment;
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
                        <span> <AttachmentIcon style={{color: 'dimgrey'}} /> <input multiple type="file" /> </span>
                        <span><SaveButton color="primary" isLoading={pending} onClick={editAttachment} /></span>
                    </Fragment>
                :
                    <Fragment>
                        <AttachmentIcon className={classes.icon} /> <Link component={NavigateTo}> {attachment} </Link>
                        <span>
                            <Editable canEdit={edit === null} onEditClick={edit === null ? () => {} : onEditClick} canDelete={canDelete} onDeleteClick={onDeleteClick}
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

export default connect(null, mapDispatchToProps)(Attachment);