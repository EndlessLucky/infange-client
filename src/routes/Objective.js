import React, { PureComponent, Fragment } from "react";
import ObjectiveView from "../views/Objectives";
import Add from "../containers/Objective/Create";
import { Route } from "react-router-dom";
import Edit from "../containers/Objective/Edit";
import ObjectiveList from "../containers/Objective";

class ObjectiveRoute extends PureComponent {
  render() {
    const {
      match: { url }
    } = this.props;
    return (
      <Fragment>
        <ObjectiveView {...this.props}>
          <Route exact path={`${url}`} component={ObjectiveList} />

          <Route exact path={`${url}/Add/:id`} component={Add} />
          <Route exact path={`${url}/Edit/:id`} component={Edit} />
        </ObjectiveView>
      </Fragment>
    );
  }
}

export default ObjectiveRoute;
