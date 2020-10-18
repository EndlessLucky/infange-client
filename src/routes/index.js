import React, { Component, useState } from "react";
import Organization from "../views/Organizations";
import withAuth from "../hocs/authenticatedRoute";
import { Switch, Route, Redirect } from "react-router-dom";
import AppBar from "../containers/Nav";
import { connect } from "react-redux";
import { activeOrganization, getOrganization } from "../actions/organization";
import Dashboard from "../views/Dashboard";
import Objective from "./Objective";
import Meeting from "./Meeting";
import Note from "./Note";
import User from "./User";
import Profile from "../views/Profile";
import ChangePassword from "../containers/Nav/AppBar/ChangePassword";

const mapStateToProps = (state) => {
  return { organizations: state.organizations };
};

const mapDispatchToProps = (dispatch) => ({
  setActive: (org) => dispatch(activeOrganization(org)),
  getOrganizations: () => dispatch(getOrganization()),
});

class DefaultOrganization extends Component {
  async componentDidMount() {
    if (!this.props.organizations.activeID) {
      let orgs = await this.props.getOrganizations();
      await this.props.setActive(orgs[0]);
    }
  }

  render() {
    const { activeID } = this.props.organizations;
    return activeID ? <Redirect to={`/${activeID}`} /> : null;
  }
}

const DefaultRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultOrganization);

const AuthRoutes = (props) => {
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const updateAvatar = () => setUpdatedAt(new Date());
  let appBarProps = { ...props, updatedAt };
  let profileProps = { ...props, updateAvatar };
  return (
    <div>
      <AppBar {...appBarProps} />
      <Switch>
        {/* <Route exact path="/AddMeeting" component={AddMeetings} />
        <Route exact path="/AddObjective" component={AddObjective} />
        <Route exact path="/AddNote" component={AddNote} /> */}
        <Route exact path="/Organizations" component={Organization} />
        <Route
          exact
          path={`/Profile`}
          render={(props) => <Profile {...profileProps} />}
        />
        <Route exact path={"/Change"} component={ChangePassword} />
        <Route
          path={`/Objectives`}
          render={(props) => <Objective {...props} />}
        />
        <Route path={`/Meetings`} component={Meeting} />
        <Route path={`/Users`} component={User} />
        <Route path={`/Notes`} component={Note} />
        <Route path={`/Dashboard`} component={Dashboard} />
        <Route
          exact
          path={`/Dashboard`}
          render={(props) => <Dashboard {...props} />}
        />
        <Route path="*">
          <Redirect to={`/Dashboard`} />
        </Route>
      </Switch>
    </div>
  );
};

export default withAuth(AuthRoutes);
