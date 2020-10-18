import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { token } from '../helpers/storage';
import { getMeeting } from '../actions/meeting';
import { getObjectives } from '../actions/objective';
import { getNotifications } from '../actions/notification';
import { getUsers } from '../actions/user';
import { getNote } from '../actions/note';
import { connect } from "react-redux";

const mapDispatchToProps = dispatch => ({
    getMeetings: () => dispatch(getMeeting()),
    getObjectives: () => dispatch(getObjectives()),
    getNotes: () => dispatch(getNote()),
    getUsers: () => dispatch(getUsers()),
})

let AuthenticatedRoute = ComposedComponent => connect(null, mapDispatchToProps)(class extends Component {
    async componentDidMount() {
        if (token.refresh) {
            Promise.all([this.props.getMeetings(), this.props.getObjectives(), this.props.getNotes(),
            this.props.getUsers()]);
        }
    }
    render() {
        if (!token.refresh) {
            return <Redirect to={{
                pathname: '/Login',
                state: { from: this.props.location }
            }} />
        }
        return <ComposedComponent {...this.props} />
    }
})

export default AuthenticatedRoute