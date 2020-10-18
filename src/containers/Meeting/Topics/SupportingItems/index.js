import React, {Fragment, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import SubTopic from './SubTopic';
import Information from './Information';
import Image from './Image';
import Link from './Link';
import Question from './Question';
import Decision from './Decision';
import Attachment from './Attachment';
import Objective from './Objective';
import Loading from '../../../../components/controls/Loading';
import {deleteSupportingItem} from "../../../../actions/supportingItem";


const SupportingItems = ({items = [], meetingID, topicID, _id, deleteSupportingItem}) => {
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if(items.length) {
            setHasFetched(true);
        }
    },[items])

    const handleDeleteClick = (meetingID, topicID, _id) => () => {
        deleteSupportingItem(meetingID, topicID, _id);
    }     
    
    const sptComp = items.map(x => {
        if(x.type === 'SubTopic') {
            return <SubTopic key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Objective') {
            return <Objective key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Attachment') {
            return <Attachment key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Image') {
            return <Image key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Link') {
            return <Link key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Information') {
            return <Information key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Question') {
            return <Question key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
        else if(x.type === 'Decision') {
            return <Decision key={x._id} {...x} meetingID={meetingID} topicID={topicID} supportingItemID={_id} onDeleteClick={handleDeleteClick(meetingID, topicID, x._id)} />
        }
    })

    return (
        <Fragment>
            {!hasFetched && <Loading color="primary" />}
            {sptComp}
        </Fragment>
    )
}

const mapDispatchToProps = dispatch => ({
    deleteSupportingItem: (meetingID, topicID, _id) => dispatch(deleteSupportingItem(meetingID, topicID, _id))
});

export default connect(null, mapDispatchToProps)(SupportingItems);