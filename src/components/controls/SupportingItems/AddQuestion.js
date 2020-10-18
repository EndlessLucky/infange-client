import React, {useState} from 'react';
import { connect } from 'react-redux';
import useForm from '../../../hooks/useForm';
import {createSupportingItem} from "../../../actions/supportingItem";
import QuestionIcon from '@material-ui/icons/Help';
import TextField from '../TextBox';
import {SaveButton} from '../Button';
import {CancelButton} from '../Button';


const AddQuestion = ({meetingID, topicID, createSupportingItem, onClose}) => {
    const [pending, setPending] = useState(false);
    const [values, handleChange] = useForm({description: ''});

    function isValid() {
        return !(values.description.trim().length === 0);
    }

    async function createQuestion() {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...values, type: 'Question'});
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
            <QuestionIcon />
            <TextField label="Description" name="description" fullWidth multiline rows="3" value={values.description} onChange={handleChange} />
            <SaveButton color="primary" isLoading={pending} disabled={!isValid()} onClick={createQuestion} />
            <CancelButton onClick={handleClose} />
        </div>
    )
}

const mapStateToProps = state => {
    return {users: state.users, meetings: state.meetings.byID, topics: state.topics.byMeeting, supportingItems: state.supportingItems};
}

const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
}); 
 
export default connect(mapStateToProps, mapDispatchToProps)(AddQuestion);