import React, { PureComponent, Fragment } from "react";
import NoteView from "../views/Notes";
import Add from "../containers/Note/Create";
import { Route } from "react-router-dom";
import NoteList from "../containers/Note";
import Edit from "../containers/Note/Edit";

class NoteRoute extends PureComponent {
  render() {
    const {
      match: { url },
    } = this.props;
    return (
      <Fragment>
        <NoteView {...this.props}>
          <Route exact path={`${url}`} component={Edit} />
          <Route exact path={`${url}/Add`} component={Add} />
          {/* <Route exact path={`${url}/Edit/:id`} component={Edit} /> */}
        </NoteView>
      </Fragment>
    );
  }
}

export default NoteRoute;
