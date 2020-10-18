import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';
import SubTopicIcon from '../SubTopic';
import useForm from '../../../hooks/useForm';
import {createSupportingItem} from "../../../actions/supportingItem";
import TextBox from '../../../components/controls/TextBox';
import TextField from '../../../components/controls/TextBox';
import {SaveButton} from '../../../components/controls/Button';
import {CancelButton} from '../../../components/controls/Button';
// import {SUB_TOPIC} from '../../../helpers/topicItems';

const AddSubTopic = ({meetingID, topicID, createSupportingItem, onClose}) => {
    // const type = SUB_TOPIC;
    const [pending, setPending] = useState(false);
    const [values, handleChange] = useForm({title: '', description: ''});

    function isValid() {
        return !(values.title.trim().length === 0 || values.description.trim().length === 0);
    }

    async function createSubTopic() {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...values, type: 'SubTopic'});
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
        <SubTopicIcon />
        <div>        
            <TextBox label="Topic Title" name="title" inputProps={{maxLength: 30}} value={values.title} onChange={handleChange} />
            <TextField label="Description" name="description" fullWidth multiline rows="3" value={values.description} onChange={handleChange} />
            <SaveButton color="primary" isLoading={pending} disabled={!isValid()} onClick={createSubTopic} />
            <CancelButton onClick={handleClose} />   
        </div>
        </Fragment>
    )
}

const mapStateToProps = state => {
    return {users: state.users, supportingItems: state.supportingItems};
}
 
const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSubTopic);