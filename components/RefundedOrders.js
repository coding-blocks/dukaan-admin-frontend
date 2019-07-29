import React from "react";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1vh"
  }
};
class RefundedOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRefundDetailModal: false,
      paymentMethod: this.props.payment_type,
      formValues: {
        payment_type: "credits",
        user_id: this.props.userid,
        txn_id: this.props.txn_id
      }
    };
  }

  closeRefundDetailModal = () => {
    this.setState({
      showRefundDetailModal: false
    });
  };

  openRefundDetailModal = () => {
    this.setState({
      showRefundDetailModal: true
    });
  };

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.showRefundDetailModal}
          onRequestClose={this.closeRefundDetailModal}
          style={customStyles}
        >
          <h3>Refund Details</h3>
          <div class="divider-h mt-4 mb-4" />
          <div className="row justify-content-center p-4">
            <div className=" pt-4 mb-4">
              <div className="row justify-content-between align-items-center">
                <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                  <div className="col-md-3 col-4">
                    <img className="round" src={this.props.image} alt="" />
                  </div>
                  <div className="description justify-content-center">
                    <div>
                      <h4>{this.props.product_name}</h4>
                      <div className="grey font-sm">
                        {this.props.description}
                      </div>
                    </div>
                  </div>
                </div>
                <div>Payment status: {this.props.status}</div>
                <div className="col-md-5">
                  <div className="row no-gutters justify-content-between font-mds red extra-bold">
                    <div>Amount Refunded = </div>
                    <div className="font-md">
                      ₹ {"" + this.props.amount_refunded / 100}
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="row no-gutters justify-content-between font-mds red extra-bold">
                    <div>Order Total = </div>
                    <div className="font-md">₹ {this.props.amount}</div>
                  </div>

                  <div className="font-sm grey">
                    Purchased on {this.props.date}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>

        <div className="row justify-content-center p-4">
          <div className="border-card pt-4 mb-4">
            <div className="row justify-content-between align-items-center">
              <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                <div className="col-md-3 col-4">
                  <img className="round" src={this.props.image} alt="" />
                </div>
                <div className="description justify-content-center">
                  <div>
                    <h4>{this.props.product_name}</h4>
                    <div className="grey font-sm">{this.props.description}</div>
                  </div>
                </div>
              </div>
              <div>Payment status: {this.props.status}</div>

              <div className="col-md-4">
                <div className="row no-gutters justify-content-between font-mds red extra-bold">
                  <div>Order Total </div>
                  <div className="font-md">₹ {this.props.amount}</div>
                </div>

                <div className="font-sm grey">
                  Purchased on {this.props.date}
                </div>
              </div>
            </div>
            <div class="divider-h mt-4 mb-4" />
            <div className="d-flex justify-content-between">
              {!this.props.partial_payment ? (
                <div>
                  <a href={this.props.invoice_url} target="blank">
                    <button className="button-solid lg">View Invoice</button>
                  </a>
                  <button
                    id="view-invoice"
                    className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5 lg"
                    type="submit"
                    onClick={this.openRefundDetailModal}
                  >
                    Refund Details
                  </button>
                </div>
              ) : (
                ""
              )}

              {this.props.partial_payment ? (
                <a
                  href={`/admin/PartialHistory?userid=${
                    this.props.userid
                  }&cart_id=${this.props.cart_id}`}
                  class="button-solid lg"
                  target="blank"
                >
                  View all Transactions
                </a>
              ) : (
                ""
              )}
              <input id="orderIdInput" type="hidden" />
              <div className="row justify-content-center">
                <a target="blank" id="anchorInvoiceUpdate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RefundedOrders;
