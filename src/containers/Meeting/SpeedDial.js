import React, {useState, Fragment} from 'react';
import {connect} from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import LinkIcon from '@material-ui/icons/Link';
import ImageIcon from '@material-ui/icons/Image';
import QuestionIcon from '@material-ui/icons/Help';
import InformationIcon from '@material-ui/icons/Info';
import AttachmentIcon from '@material-ui/icons/Attachment';

import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import CreateObjective from '../../containers/Objective/Create';
import {createSupportingItem} from "../../actions/supportingItem";

import Modal from '../../components/controls/Modal';
import {IconButton} from '../../components/controls/Button';
import SubTopicIcon from '../../components/controls/SubTopic';
import ObjectivesIcon from '../../components/controls/Objectives';
import DecisionIcon from '../../components/controls/Decision';
import AddLink from '../../components/controls/SupportingItems/AddLink';
import AddImage from '../../components/controls/SupportingItems/AddImage';
import AddQuestion from '../../components/controls/SupportingItems/AddQuestion';
import AddDecision from '../../components/controls/SupportingItems/AddDecision';
import AddSubTopic from '../../components/controls/SupportingItems/AddSubTopic';
import AddAttachment from '../../components/controls/SupportingItems/AddAttachment';
import AddInformation from '../../components/controls/SupportingItems/AddInformation';

import {makeStyles} from '@material-ui/core/styles';


const useStyles = makeStyles({
   icon: {
       backgroundColor: 'orange',
       color: '#fff'       
   },
   addIcon: {
       fontSize: '15px'
   }
})

// Ideally if we are doing this the parent component should decide the direction and location of the absolute positioned expansion
const SpeedDialButton = ({meetingID, topicID, createSupportingItem, _id, onClick, open = true, onClose, ...props}) => {
    
    const [pending, setPending] = useState(false);   
    const [openLink, setOpenLink] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [openQuestion, setOpenQuestion] = useState(false);
    const [openDecision, setOpenDecision] = useState(false);
    const [openSubTopic, setOpenSubTopic] = useState(false);
    const [openObjective, setOpenObjective] = useState(false);
    const [openAttachment, setOpenAttachment] = useState(false);    
    const [openInformation, setOpenInformation] = useState(false);  
    const classes = useStyles();

    const addItems = [
        { icon: <SubTopicIcon onClick={() => setOpenSubTopic(true)} />, name: 'Sub Topic' },
        { icon: <ObjectivesIcon onClick={() => setOpenObjective(true)} />, name: 'Objectives'},
        { icon: <AttachmentIcon onClick={() => setOpenAttachment(true)} />, name: 'Attachment' },
        { icon: <ImageIcon onClick={() => setOpenImage(true)} />, name: 'Image' },
        { icon: <LinkIcon onClick={() => setOpenLink(true)} />, name: 'Link' },
        { icon: <InformationIcon onClick={() => setOpenInformation(true)} />, name: 'Information' },
        { icon: <QuestionIcon onClick={() => setOpenQuestion(true)} />, name: 'Question' },
        { icon: <DecisionIcon onClick={() => setOpenDecision(true)} />, name: 'Decision' }
    ]

    async function createObjective(obj) {
        try {
            setPending(true);
            await createSupportingItem(meetingID, topicID, {...{description: obj.description, objectiveID: obj._id}, type: 'Objectives'});
            setOpenObjective(false);
            onClose();
        }
        catch(err) {
            console.warn(err);
        }
        setPending(false);
    }

    return (
        <Fragment>
            <div style={{textAlign: 'right', marginBottom: '10px'}}>
                {<span>
                    {addItems.map(action => (
                        <SpeedDialAction 
                            key={action.key}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            placement="top"
                            open={open}                       
                        />
                    ))}
                </span>}
                <IconButton className={classes.icon} onClick={onClick}><AddIcon className={classes.addIcon} /></IconButton>
            </div>

                <div> {openSubTopic && <div> <AddSubTopic meetingID={meetingID} topicID={topicID} onClose={() => setOpenSubTopic(false)} /> </div>} </div>

                <div> {openObjective && 
                    <div>
                        <Modal open={openObjective} onClose={() => {setOpenObjective(false)}} title="Create Objective">
                            <CreateObjective meetingID={meetingID} topicID={topicID} onComplete={createObjective} />
                        </Modal>
                    </div>} 
                </div>

                <div> {openLink && <div> <AddLink meetingID={meetingID} topicID={topicID} onClose={() => setOpenLink(false)} /> </div>} </div>

                <div> {openAttachment && <div> <AddAttachment meetingID={meetingID} topicID={topicID} onClose={() => setOpenAttachment(false)} /> </div>} </div>

                <div> {openImage && <div> <AddImage meetingID={meetingID} topicID={topicID} onClose={() => setOpenImage(false)} /> </div>} </div>

                <div> {openInformation && <div> <AddInformation meetingID={meetingID} topicID={topicID} onClose={() => setOpenInformation(false)} /> </div>} </div>

                <div> {openQuestion && <div> <AddQuestion meetingID={meetingID} topicID={topicID} onClose={() => setOpenQuestion(false)} /> </div>} </div>

                <div> {openDecision && <div> <AddDecision meetingID={meetingID} topicID={topicID} onClose={() => setOpenDecision(false)} /> </div>} </div>
        </Fragment>
)} 

const mapStateToProps = state => {
    return {users: state.users, meetings:state.meetings.list, topics: state.topics.byMeeting, supportingItems: state.supportingItems}
}

const mapDispatchToProps = dispatch => ({   
    createSupportingItem: (meetingID, topicID, supportingItem) => dispatch(createSupportingItem(meetingID, topicID, supportingItem))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpeedDialButton);