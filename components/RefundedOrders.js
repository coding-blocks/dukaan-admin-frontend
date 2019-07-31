import React from "react";
import Modal from "react-modal";
import Price from "./Price";
import moment from "moment";
import axios from "axios";
import "../controllers/config";

const customStyles = {
  content: {
    padding: "10vh",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "2vh",
    ariaHideApp: "false"
  }
};
class RefundedOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRefundDetailModal: false,
      refundDetail: {},
      paymentMethod: this.props.payment_type,
      formValues: {
        payment_type: "credits",
        user_id: this.props.userid,
        txn_id: this.props.txn_id
      }
    };
  }

  handleRefundDetails = () => {
    axios
      .get(`/api/v2/admin/refunds?txn_id=${this.props.txn_id}`, {
        withCredentials: true
      })
      .then(res => {
        this.setState({
          refundDetail: res.data,
          showRefundDetailModal: true
        });
      });
  };

  closeRefundDetailModal = () => {
    this.setState({
      showRefundDetailModal: false
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
          <h3 className="red">Refund Details</h3>
          <div className="divider-h mb-4 mt-4" />
          <div>
            <div className="font-mds">
              <h2>Amount Refunded: </h2>{" "}
              {this.state.refundDetail.amount_paid / 100}
            </div>
            <div className="divider-h mb-4 mt-4" />
            <div className="font-mds">
              <h2>Payment Status:</h2> {this.state.refundDetail.status}
            </div>
            <div className="divider-h mb-4 mt-4" />
            <div className="font-mds">
              <h2>Payment Mode:</h2> {this.state.refundDetail.type}
            </div>
            <div>
              <div className="divider-h mb-4 mt-4" />
              <div className="font-mds">
                <h2>Refund Date: </h2>{" "}
                {moment(this.state.refundDetail.created_at).format(
                  "MMMM Do YYYY,h:mm:ss a"
                )}
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

              <div className="col-md-12">
                <div className="col-md-5 px-0 pt-4 mr-3 mb-4">
                  <Price amount={this.props.amount} />
                </div>
                <div className="font-sm grey">
                  Purchased on {this.props.date}
                </div>
              </div>
            </div>
            <div className="divider-h mt-4 mb-4" />
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
                    onClick={this.handleRefundDetails}
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
                  className="button-solid lg"
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
