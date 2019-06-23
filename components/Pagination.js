/**
 * Pagination component
 */

import React from 'react';
import "../styles/components/Pagination.scss";

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      count: props.count,
      limit: props.limit,
      numPages: 0
    }
  }

  handleClick = (event) => {
    let paginationButton = event.currentTarget.getAttribute("name").split("-")[1];
    let offset = (paginationButton - 1) * this.state.limit;
    this.props.changePageCallback(offset);
  }

  /**
   * Generates and returns the JSX for pagination buttons
   * @returns {object} pageButtons – Pagination Buttons
   */
  createPageButtons = () => {
    let pageButtons = [];
    for (let i = 1; i <= this.state.numPages; i++) {
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

  componentDidMount() {
    let numPages = Math.ceil(this.state.count / this.state.limit);
    this.setState({
      numPages
    });
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