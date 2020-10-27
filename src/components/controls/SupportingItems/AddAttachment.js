import React, {useState, Fragment} from 'react';
import { connect } from 'react-redux';
import useForm from '../../../hooks/useForm';
import AttachmentIcon from '@material-ui/icons/Attachment';
import {SaveButton} from '../Button';
import {CancelButton} from '../Button';
import {createSupportingItem} from "../../../actions/supportingItem";

const AddAttachment = ({meetingID, topicID, createSupportingItem, onClose}) => {
    const [pending, setPending] = useState(false);
    const [values, handleChange] = useForm({attachment: ''});


    async function createAttachment() {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...values, type: 'Attachment'});
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
            <div> <AttachmentIcon /> </div>
            <div> 
                <input multiple type="file" onChange={handleChange} />
                <SaveButton color="primary" isLoading={pending} onClick={createAttachment} onChange={handleChange} />
                <CancelButton onClick={handleClose} />
            </div>
        </Fragment>
    )
}
 
const mapStateToProps = state => {
    return {meetings: state.meetings.byID, topics: state.topics.byMeeting, supportingItems: state.supportingItems, users: state.users};
}

const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
}); 
 
export default connect(mapStateToProps, mapDispatchToProps)(AddAttachment);