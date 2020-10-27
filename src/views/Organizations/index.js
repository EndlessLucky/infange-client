import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Add from "../../containers/Organization/Create";
import Default from "../../containers/Organization";

class OrganizationView extends Component {
  state = {
    organizations: null,
  };
  render() {
    return (
      <div>
        <h1>Organizations</h1>
        <Switch>
          <Route exact path="/Organizations" component={Default} />
          <Route exact path="/Organizations/Add" component={Add} />
          <Route path="*">
            <Redirect exact to="/Organizations" />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default OrganizationView;
