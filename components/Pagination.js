/**
 * Pagination component
 */

import React from 'react';
import "../styles/components/Pagination.scss";

class Pagination extends React.Component {

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentWillMount() {
    window.onkeydown = this.keyboardNavigationHandler;
  }

  componentWillUnmount() {
    window.onkeydown = null;
  }

  keyboardNavigationHandler = (e) => {
    switch (e.keyCode) {
      case 37:
        this.previous();
        break;
      case 39:
        this.next();
        break;
    }
  }

  previous = () => {
    // TODO: Add previous functionality
    if (this.props.pagesInfo.currentPage <= this.props.pagesInfo.pageCount) {
      this.props.changePageCallback(this.props.pagesInfo.currentPage-1);
    }
  }

  next = () => {
    if (this.props.pagesInfo.currentPage < this.props.pagesInfo.pageCount) {
      this.props.changePageCallback(this.props.pagesInfo.currentPage+1);
    }
  }

  handleClick = (event) => {
    let selectedPage = event.currentTarget.getAttribute("name").split("-")[1];
    this.props.changePageCallback(selectedPage);
  }
  
  render() {
    return (
      <div className={"d-flex justify-content-center"}>
        {
          (this.props.pagesInfo.currentPage <= this.props.pagesInfo.pageCount) 
          && 
          (this.props.pagesInfo.currentPage > 1)
          &&
          <button 
            className={"navbutton right"}
            onClick={this.previous}
          >
            <i class="fa fa-chevron-left"></i>
          </button> 
        }
        <div class="info">
          {this.props.pagesInfo.currentPage} of {this.props.pagesInfo.pageCount}
        </div>
        {
          (this.props.pagesInfo.currentPage < this.props.pagesInfo.pageCount) 
          && 
          <button 
            className={"navbutton left"}
            onClick={this.next}
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        }
      </div>
    );
  }
  
}

export default Pagination;