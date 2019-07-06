import React from "react";

class CompleteOrder extends React.Component {
  render() {
    return (
      <div
        className="row justify-content-center p-4"
        id="complete_orders_section"
      >
        <div className="border-card pt-4 mb-4">
          <div className="row justify-content-between align-items-center">
            <div className="img-desc col-md-7 col-12 mb-4 mb-md-0">
              <div className="col-md-3 col-4">
                <img className="round" src={this.props.image} alt="" />
              </div>
              <div className="description justify-content-center">
                <div>
                  <h4>{this.props.product_name}</h4>
                  <div className="grey font-sm">Some Description</div>
                </div>
              </div>
            </div>
            <div>Payment status: {this.props.status}</div>

            <div className="col-md-4">
              <div className="row no-gutters justify-content-between font-mds red extra-bold">
                <div>Order Total</div>
                <div className="font-md">₹ {this.props.amount}</div>
              </div>
              <div className="font-sm grey">Purchased on Wed Jun 12 2019</div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <a href={this.props.invoice_url} target="blank">
              <button className="button-solid lg">View Invoice</button>
            </a>
            {this.props.refunded ? (
              <button className="button-solid lg">Refund</button>
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
    );
  }
}

export default CompleteOrder;
