import React from "react";
import "../styles/components/Modal.scss";

class Modal extends React.Component {
  render() {
    return (
      <div
        className="border-card col-md-12"
        style={{
          boxShadow:
            "0 5px 8px 0 rgba(0, 0, 0, 0.3), 0 7px 20px 0 rgba(0, 0, 0, 0.17)",
          position: "absolute",
          zIndex: 1500,
          backdropFilter: blur("10px")
        }}
      >
        <div>
          <div className="modal-header">
            <h3>Refund Payment</h3>
          </div>
          <div className="modal-body">
            <p>{this.props.children}</p>
          </div>
          <div className="modal-footer">
            <button className="button-solid lg mr-4" onClick={this.props.close}>
              CLOSE
            </button>
            <button
              className="button-solid lg"
              onClick={this.props.handleSubmit}
            >
              REFUND
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
