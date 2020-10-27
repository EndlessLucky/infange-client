import React, {PureComponent} from 'react';
import Proptypes from 'prop-types';

/**
 * Select an image file.
 */
const imageType = /^image\//;
// const fileInput = document.querySelector('#file-picker');
//
// fileInput.addEventListener('change', (e) => {
//     const file = e.target.files.item(0);
//z
//     if (!file || !imageType.test(file.type)) {
//         return;
//     }
//
//     const reader = new FileReader();
//
//     reader.onload = (e2) => {
//         loadEditView(e2.target.result);
//     };
//
//     reader.readAsDataURL(file);
// });

class ImageUpload extends PureComponent {
    static propTypes = {
        onUpload: Proptypes.func.isRequired
    }

    handleChange = (e) => {
        const file = e.target.files.item(0);

        if (!file || !imageType.test(file.type)) {
            return;
        }
        const reader = new FileReader();

        reader.onload = (e2) => {
            this.props.onUpload(e2.target.result);
        }
        reader.readAsDataURL(file);
    }
    render() {
        return (
            <input style={{display: 'none'}} id="profileUpload" type="file"  accept='image/*' onChange={this.handleChange} />
        )
    }
}

export default ImageUpload