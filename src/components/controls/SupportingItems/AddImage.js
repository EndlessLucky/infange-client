import React, {useState, Fragment} from 'react';
import PropTypes from 'prop-types'; 
import ReactCrop from 'avatar-image';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import useForm from '../../../hooks/useForm';
import {SaveButton} from '../../../components/controls/Button';
import {CancelButton} from '../Button';
import ImageUpload from '../../../components/controls/Upload/Image';
import {createSupportingItem} from "../../../actions/supportingItem";


const AddImage = ({meetingID, topicID, createSupportingItem, type, onUpload, onClose, ...props}) => {
    
    const [file, setFile] = useState(null);
    const [dataUrl, setDataUrl] = useState(null);
    const [pending, setPending] = useState(false);       
    const [values] = useForm({image: '', type: 'Image'});

    function handleChange(event) {
        setFile(URL.createObjectURL(event.target.files[0]));
    }
  
    function handleUpload() {
        setDataUrl(null);
    }

    async function createImage() {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...values}, values.image);
            onClose();
        }
        catch(err) {
            console.warn(err);
        }
        setPending(false);
    }

    function handleClose(value) {
        onClose(value);
    }

    return (
        <Fragment>
            <div> 
                <ImageIcon /> 
                <Avatar style={{ borderRadius: 0 }} src={file} />
            </div>

            <input type="file" accept='image/*' onChange={handleChange} />
    
            <SaveButton color="primary" onClick={createImage} isLoading={pending} />
            <CancelButton onClick={handleClose} />
        </Fragment>
    )
}

AddImage.propTypes = {
    onUpload: PropTypes.string.isRequired,
};
 
const mapStateToProps = state => {
    return {meetings: state.meetings.byID, topics: state.topics.byMeeting, supportingItems: state.supportingItems, users: state.users};
}

const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
}); 
 
export default connect(mapStateToProps, mapDispatchToProps)(AddImage);