import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import Link from "@material-ui/core/Link";
import useForm from "../../../hooks/useForm";
import { Link as RouterLink } from "react-router-dom";
import { createSupportingItem } from "../../../actions/supportingItem";
import LinkIcon from "@material-ui/icons/Link";
import TextBox from "../TextBox";
import { SaveButton } from "../Button";
import { CancelButton } from "../Button";

const AddLink = ({ meetingID, topicID, createSupportingItem, onClose }) => {
  const [pending, setPending] = useState(false);
  const [values, handleChange] = useForm({ link: "" });

  const NavigateTo = props => <RouterLink to="" {...props} />;

  async function createLink() {
    try {
      setPending(true);
      await createSupportingItem(meetingID, topicID, {
        ...values,
        type: "Link"
      });
      onClose();
    } catch (err) {
      console.warn(err);
    }
    setPending(false);
  }

  function handleClose(value) {
    onClose(value);
  }

  return (
    <Fragment>
      <LinkIcon />
      <div>
        <TextBox
          label="Link"
          name="link"
          value={values.link}
          onChange={handleChange}
        >
          <Link variant="h6" component={NavigateTo} />
        </TextBox>
        <SaveButton color="primary" isLoading={pending} onClick={createLink} />
        <CancelButton onClick={handleClose} />
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => {
  return {
    meetings: state.meetings.byID,
    topics: state.topics.byMeeting,
    supportingItems: state.supportingItems,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => ({
  createSupportingItem: (meetingID, topicID, supportingItem) =>
    dispatch(createSupportingItem(meetingID, topicID, supportingItem))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLink);
