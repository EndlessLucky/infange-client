import React, {PureComponent, Fragment}  from 'react';
import MeetingView from '../views/Meetings';
import Add from "../containers/Meeting/Create";
import {Route} from 'react-router-dom';
import MeetingList from '../containers/Meeting';
import View from '../containers/Meeting/View';

class UserRoute extends PureComponent {

    render() {
        const {match: {url}} = this.props;
        return (
            <Fragment>
                <MeetingView {...this.props}>
                    <Route exact path={`${url}`} component={MeetingList} />
                    <Route exact path={`${url}/:id`} component={View} />
                    <Route exact path={`${url}/Add`} component={Add} />
                </MeetingView>
            </Fragment>
        )
    }
}

export default UserRoute;