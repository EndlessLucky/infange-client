import React, { Fragment, useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import useForm from "../../../hooks/useForm";
import { SaveButton, DeleteButton } from "../../../components/controls/Button";
import TextBox, { DateTimePicker } from "../../../components/controls/TextBox";
import MultiSelect from "multiselect";
import MeetingFields from "../../Meeting/Fields";
import { deleteMeeting, editMeeting } from "../../../actions/meeting";
import { useAccount } from "../../../context/AccountProvider";
import Dialog from "../../../components/Dialog";
import Button from "../../../components/controls/Button";

const handleInvitees = (i) => {
  let t = {};
  t.value = i;
  t.name = "invitees";
  let e = { target: t };
  this.props.onChange(e);
};

const Fields = ({
  meeting: {
    _id,
    createDate,
    invitees,
    status,
    type,
    organizationID,
    ownerID,
    users,
    startDate,
    endDate,
    // ...updateableProps
    ...props
  },
  update,
  remove,
  onClose,
}) => {
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [account] = useAccount();
  const [sd, setStartDate] = useState(moment(startDate));
  const [ed, setEndDate] = useState(moment(endDate));
  const [values, handleChange] = useForm(props);
  const globalDispatch = useDispatch();

  async function editMtng() {
    try {
      setPending(true);
      await update({
        _id,
        createDate,
        invitees,
        status,
        type,
        users,
        organizationID,
        ownerID,
        ...values,
        startDate: sd.toDate(),
        endDate: ed.toDate(),
      });
      onClose();
    } catch (err) {
      console.warn(err);
    }
    setPending(false);
  }

  async function deleteMtng() {
    try {
      setConfirmDelete(true);
      await remove({
        _id,
        createDate,
        invitees,
        status,
        type,
        users,
        organizationID,
        ownerID,
        ...values,
        startDate: sd.toDate(),
        endDate: ed.toDate(),
      });
      onClose();
    } catch (err) {
      console.warn(err);
      setConfirmDelete(false);
      setError(err);
    }
  }

  useEffect(() => {
    if (account.data) {
      setIsOwner(Boolean(account.data.find((x) => x._id === ownerID)));
    }
  }, [account.data]);

  return (
    <Fragment>
      <Dialog
        title={"Delete meeting?"}
        message={"Permanently delete this meeting."}
        open={confirmDelete}
        actionContent={
          <>
            <Button
              variant="text"
              color="primary"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="text" color="primary" onClick={deleteMtng}>
              Delete
            </Button>
          </>
        }
      />
      <div>
        <TextBox
          label="Title"
          name="title"
          onChange={handleChange}
          //  inputProps={{ maxLength: 30 }}
          value={values.title}
          disabled={!isOwner}
        />
      </div>
      <div>
        <DateTimePicker
          label="Start Time"
          onChange={setStartDate}
          value={sd}
          disabled={!isOwner}
        />
        <DateTimePicker
          label="End Time"
          onChange={setEndDate}
          value={ed}
          disabled={!isOwner}
        />
        <TextBox
          label="Location"
          name="location"
          onChange={handleChange}
          inputProps={{ maxLength: 30 }}
          value={values.location}
          disabled={!isOwner}
        />
      </div>

      <div style={{ display: "inline-flex" }}>
        <div>
          <SaveButton
            color="primary"
            onClick={editMtng}
            isLoading={pending}
            disabled={!isOwner}
          />{" "}
        </div>

        <div style={{ alignSelf: "center" }}>
          <DeleteButton
            color="primary"
            // onClick={deleteMtng}
            onClick={() => setConfirmDelete(true)}
            disabled={!isOwner}
          />
        </div>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => {
  return { meetings: state.meetings.byID, users: state.users };
};

const mapDispatchToProps = (dispatch) => ({
  update: (mtng) => dispatch(editMeeting(mtng)),
  remove: (mtng) => dispatch(deleteMeeting(mtng)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Fields);
