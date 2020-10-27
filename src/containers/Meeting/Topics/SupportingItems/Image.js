import React, {Fragment, useState} from 'react';
import {connect} from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
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

const Image = ({meetingID, topicID, _id, image, type, ownerID, update, canEdit, canDelete = true, onDeleteClick, ...props}) => {

    const [edit, setEdit] = useState(canEdit === null ? null : false);
    const [sImage, setImage] = useState(image);
    const [file, setFile] = useState(null);
    const [pending, setPending] = useState(false);
    const [largeImage, setLargeImage] = useState(false);
    const classes = useStyles(); 

    function onEditClick() {
        setEdit(true); 
        setImage(image);
    }

    function handleChange(event) {
        setFile(URL.createObjectURL(event.target.files[0]));
    }

    function handleShowDialog() {
        setLargeImage(!largeImage);
    }

    async function editImage() {
        try {
            setPending(true);
            let updated = {};
            if(image !== sImage) updated.image = sImage;
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
                        <span> <ImageIcon style={{color: 'dimgrey'}} /> <input accept='image/*' type="file" onChange={handleChange} /> </span>
                        <span> <SaveButton color="primary" isLoading={pending} onClick={editImage} /> </span>
                    </Fragment>
                :
                    <Fragment>
                        <ImageIcon className={classes.icon} /> 
                        <Avatar style={{ borderRadius: 0 }} src={image} onClick={handleShowDialog} />
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

export default connect(null, mapDispatchToProps)(Image);