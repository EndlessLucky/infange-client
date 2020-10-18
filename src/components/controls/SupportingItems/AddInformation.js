import React, {useState} from 'react';
import { connect } from 'react-redux';
import useForm from '../../../hooks/useForm';
import {createSupportingItem} from "../../../actions/supportingItem";
import InformationIcon from '@material-ui/icons/Info';
import TextField from '../TextBox';
import {SaveButton} from '../Button';
import {CancelButton} from '../Button';


const AddInformation = ({meetingID, topicID, createSupportingItem, onClose}) => {
    const [pending, setPending] = useState(false);
    const [values, handleChange] = useForm({description: ''});

    function isValid() {
        return !(values.description.trim().length === 0);
    }

    async function createInfo() {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...values, type: 'Information'});
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
        <div>
            <InformationIcon />
            <TextField label="Description" name="description" fullWidth multiline rows="3" value={values.description} onChange={handleChange} />
            <SaveButton color="primary" isLoading={pending} disabled={!isValid()} onClick={createInfo} />
            <CancelButton onClick={handleClose} />
        </div>
    )
}

const mapStateToProps = state => {
    return {meetings: state.meetings.byID, topics: state.topics.byMeeting, supportingItems: state.supportingItems, users: state.users};
}

const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
});   
 
export default connect(mapStateToProps, mapDispatchToProps)(AddInformation);