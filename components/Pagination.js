/**
 * Pagination component
 */

import React from 'react';
import "../styles/components/Pagination.scss";

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pagesInfo: props.pagesInfo
    }
  }

  previous = () => {
    // TODO: Add previous functionality
  }

  next = () => {
    // TODO: Add next functionality
  }

  handleClick = (event) => {
    let selectedPage = event.currentTarget.getAttribute("name").split("-")[1];
    this.props.changePageCallback(selectedPage);
  }
  
  render() {
    return (
      <div className={"d-flex justify-content-center"}>
        <button 
          className={"navbutton right"}
          onClick={this.previous}
        >
          <i class="fa fa-chevron-left"></i>
        </button>
        <div class="info">
          {this.props.pagesInfo.currentPage} of {this.props.pagesInfo.pageCount}
        </div>
        <button 
          className={"navbutton left"}
          onClick={this.next}
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    );
  }
  
}

export default Pagination;