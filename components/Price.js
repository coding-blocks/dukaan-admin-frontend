import React from "react";
import "./styles/Price.scss"
class Price extends React.Component {
    
constructor(props) {
  super(props);
}

render() {
  return (
    <div className="price">
      <div className={`money p-2 ${ this.props.className }`}>
        <i className="fa fa-rupee-sign fa-1x icon_middle red" />
        <span className="info red">{this.props.amount}</span>
      </div>
    </div>
    );
  }
}

export default Price;