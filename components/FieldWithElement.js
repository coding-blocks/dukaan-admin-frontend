import React from 'react';
import "../styles/components/FieldWithElement.scss";

class FieldWithElement extends React.Component {
    render() {
        return (
            <div className={`mt-3 row d-flex ${this.props.className}`}>
                <div className={`col-md-${this.props.nameCols} name`}>
                    <span className={"text"}>{this.props.name}</span>
                </div>
                <div className={`element col-md-${this.props.elementCols}`}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default FieldWithElement;