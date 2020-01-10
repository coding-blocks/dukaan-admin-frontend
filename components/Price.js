import React from "react";
import "../styles/components/Price.scss";
import formatter from "../helpers/formatter";

class Price extends React.Component {
    
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="price">
        <div className={`pt-2 pb-2 ${ this.props.className }`}>
          <span className="info red pr-3">{formatter.formatCurrency(this.props.amount)}</span>
        </div>
      </div>
    );
  }

}

export default Price;
