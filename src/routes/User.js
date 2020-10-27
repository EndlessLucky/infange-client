import React, {PureComponent, Fragment}  from 'react';
import UserView from '../views/Users';
import Add from "../containers/User/Create";
import {Route} from 'react-router-dom';
import UserList from '../containers/User';
import Edit from '../containers/User/Edit';

class UserRoute extends PureComponent {
    
    render() {
        const {match: {url}} = this.props;
        return (
            <Fragment>
                <UserView {...this.props}>
                    <Route exact path={`${url}`} component={UserList} />
                    <Route exact path={`${url}/Add`} component={Add} />
                    <Route exact path={`${url}/Edit/:id`} component={Edit} />
                </UserView>
            </Fragment>
        )
    }
}

export default UserRoute;