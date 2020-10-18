import React from "react";
import ReactCrop from "avatar-image";
import ImageUpload from "../../components/controls/Upload/Image";

class SelectImage extends React.Component {
  render() {
    return (
      <div>
        <h1>sdfgh</h1>

        <button onClick={this.props.toggleCropModal}>Close</button>
      </div>
    );
  }
}

export default SelectImage;
