import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "../../containers/Login";
import NewAccount from "../../containers/Login/NewAccount";
import ResetPwd from "../../containers/Login/resetPwd";

class LoginView extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/Login" component={Login} />
          <Route exact path="/NewAccount" component={NewAccount} />
          <Route exact path="/reset/:token" component={ResetPwd} />
          <Route path="*">
            <Redirect exact to="/Login" />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default LoginView;
