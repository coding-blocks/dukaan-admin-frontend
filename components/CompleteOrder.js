import React from "react";
import Price from './Price';

class CompleteOrder extends React.Component {
  render() {
    return (
      <div className="row justify-content-center p-4">
        <div className="border-card pt-4">
          <div className="row justify-content-between align-items-center">
            <div className="img-desc col-md-7 col-12 mb-4 mb-md-0">
              <div className="col-md-3 col-4">
                <img
                  className="round"
                  src="../static/img/androidonline.png"
                  alt=""
                />
              </div>
              <div className="description justify-content-center">
                <div>
                  <h4>Android</h4>
                  <div className="grey font-sm">Some Description</div>
                </div>
              </div>
            </div>
            <div class="row mr-4">Payment status: Captured</div>


            <div className="col-md-12">
              <div className="font-sm grey">Purchased on Wed Jun 12 2019</div>
              <div className="d-flex justify-content-center">
                <Price amount={1670} className="pl-5 pr-5 ml-4"/>
              </div>
              <div className="d-flex justify-content-center ml-4 mt-2 red extra-bold">
                <div>Order Total</div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-5">
            <a target="blank">
              <button className="button-solid lg pl-5 pr-5 mr-2">View Invoice</button>
            </a>
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
