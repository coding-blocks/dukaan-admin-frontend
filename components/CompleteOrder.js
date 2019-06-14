import React from "react";

class CompleteOrder extends React.Component {
  render() {
    return (
      <div className="container">
        <div
          class="row justify-content-center p-4"
          id="complete_orders_section"
        >
          <div class="border-card col-md-8 col-12 pt-4 mb-4">
            <div class="row justify-content-between align-items-center">
              <div class="img-desc col-md-7 col-12 mb-4 mb-md-0">
                <div class="col-md-3 col-4">
                  <img
                    class="round"
                    src="../static/img/androidonline.png"
                    alt=""
                  />
                </div>
                <div class="description justify-content-center">
                  <div>
                    <h4>Android</h4>
                    <div class="grey font-sm">Some Description</div>
                  </div>
                </div>
              </div>
              <div>Payment status: Captured</div>

              <div class="col-md-4">
                <div class="row no-gutters justify-content-between font-mds red extra-bold">
                  <div>Order Total</div>
                  <div class="font-md">₹ 1670</div>
                </div>
                <div class="font-sm grey">Purchased on Wed Jun 12 2019</div>
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <a target="blank">
                <button class="button-solid lg">View Invoice</button>
              </a>

              <input id="orderIdInput" type="hidden" />
              <div class="row justify-content-center">
                <a target="blank" id="anchorInvoiceUpdate" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompleteOrder;
