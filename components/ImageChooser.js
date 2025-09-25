import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

class ImageChooser extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chosenURL: ''
    }
    this.ReactSwal = withReactContent(Swal);
  }

  componentDidMount() {
    let images = [
      'https://www.vidyamandir.com/assets/images/logo/think-iit-think-vmc-logo.png'
    ];

    this.imagesHTML = images.map((url, index) => {
      return (
        <img
            key={index}
          src={url}
          width={100}
          onClick={() => {
            this.chooseImageURL(url)
          }}
        />
      );
    });

    this.setState({
      images
    });

    this.dialogHTML = (
      <div>
        {!this.props.disableSwal &&
          <h3>Choose an Image</h3>
        }
        {this.imagesHTML}
      </div>
    );
  }

  /**
   * Choose Image Dialog
   */
  chooseImage = () => {
    if (!this.props.disableSwal) {
      this.ReactSwal.fire({
        html: this.dialogHTML,
        showConfirmButton: false,
        showCloseButton: true
      });
    }
  }
  
  /**
   * Set the image url in the state.
   * @param {string} url – Image URL
   */
  chooseImageURL = (url) => {
    this.props.callback(url);
    if (!this.props.disableSwal) {
      this.ReactSwal.close();
    }
  }

  render() {
    return (
      <div>
        {this.props.disableSwal &&
          this.dialogHTML
        }
        <div
          className={"button-solid col-md-4 d-flex justify-content-center"}
          onClick={this.chooseImage}
        >
          Choose Image
        </div>
      </div>
    )
  }
  
}

export default ImageChooser;