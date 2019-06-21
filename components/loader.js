import React from 'react';

class Loader extends React.Component {
  render() {
    return (
      <div class="loader height-100 w-100 d-flex flex-row justify-content-center">
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
}

export default Loader;