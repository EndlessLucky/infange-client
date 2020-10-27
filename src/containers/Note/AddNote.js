import React from "react";
import CreateNote from "./Create";
class AddNote extends React.Component {
  render() {
    return (
      <div style={{ marginLeft: 50 }}>
        <CreateNote />
      </div>
    );
  }
}

export default AddNote;
