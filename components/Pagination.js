/**
 * Pagination component
 */

import React from 'react';
import "../styles/components/Pagination.scss";

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pages: props.pages
    }
  }

  handleClick = (event) => {
    let selectedPage = event.currentTarget.getAttribute("name").split("-")[1];
    this.props.changePageCallback(selectedPage);
  }

  /**
   * Generates and returns the JSX for pagination buttons
   * @returns {object} pageButtons – Pagination Buttons
   */
  createPageButtons = () => {
    let pageButtons = [];
    for (let i = 1; i <= this.state.pages; i++) {
      pageButtons.push(
        <div 
          className={"page-num"}
          onClick={this.handleClick}
          name={`page-`+i}
        >
          <span>{i}</span>
        </div>
      );
    }
    return pageButtons;
  }
  
  render() {
    return (
      <div className={"d-flex justify-content-center"}>
        {this.createPageButtons()}
      </div>
    );
  }
  
}

export default Pagination;