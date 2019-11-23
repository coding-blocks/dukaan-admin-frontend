import React from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import Price from "./Price";
import purchasesController from "../controllers/purchases";

class ActiveOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart_id: null,
            user_id: null
        }
    }
    componentDidMount() {
        this.setState({
            cart_id: this.props.cart_id,
            user_id: this.props.userid
        })
    }
    // handleCancelReceipt = async e => {
    //     e.preventDefault();
    //     Swal.fire({
    //         title: "Are you sure you want to cancel the receipt?",
    //         type: "question",
    //         confirmButtonColor: "#f66",
    //         confirmButtonText: "Yes!",
    //         cancelButtonText: "No!",
    //         showCancelButton: true,
    //         showConfirmButton: true,
    //         showCloseButton: true
    //     })
    //     .then((result) => {
    //         if (result.value) {
    //             purchasesController.cancelReceipt(this.state.user_id, this.state.cart_id)
    //                 .then(() => {
    //                     Swal.fire({
    //                         title: "Receipt successfully cancelled",
    //                         type: "success",
    //                         timer: "3000",
    //                         showConfirmButton: true,
    //                         confirmButtonText: "Okay"
    //                     }).then(() => window.location.reload());
    //                 }).catch(err => {
    //                     Swal.fire({
    //                         title: "Error while cancelling receipt",
    //                         text: err,
    //                         type: "error",
    //                         showConfirmButton: true
    //                     });
    //                 });
    //         }
    //     })
    // }
  render() {
    return (
      <div
        className="row justify-content-center p-4"
        id="incomplete_orders_section"
      >
        <div
          className="border-card pt-4 mb-4"
          style={{ borderColor: "#ffad5f", borderWidth: ".2vh" }}
        >
          <div className="row justify-content-between align-items-center">
            <div className="col-md-7 col-12">
              <div className="img-desc mb-4 mb-md-0">
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
            </div>
            <div className="extra-bold mt-4 col-md-5">
              <span className="font-mds red">Order Total</span>
              <div className={"mt-2"}>
                <Price amount={this.props.amount} />
              </div>
            </div>
          </div>

          <div className="extra-bold mt-4 col-md-5">
            <span className="font-mds red">Remaining Balance</span>{" "}
            <div className={"mt-2"}>
              <Price amount={this.props.amountLeft / 100} />
            </div>
          </div>
          <div className="font-sm grey mt-4">
            Purchased on {this.props.date}
          </div>

          <div className="divider-h mt-4 mb-4" />
          {/* <input type="hidden" id="CartId" name="cartId" value={{payment.cart_id}}> */}

          <div className="row">
            <Link
              href={`/admin/PartialHistory?userId=${
                this.props.userid
              }&cart_id=${this.props.cart_id}`}
            >
              <button className="button-solid view-partial-payment lg">
                View all Transactions
              </button>
            </Link>

            <Link
              href={`/admin/ContinuePayment?cartId=${
                this.props.cart_id
              }&oneauthId=${this.props.oneauthid}&amountLeft=${this.props
                .amountLeft / 100}&userId=${this.props.userid}&productId=${this.props.product.id}&minBase=${this.props.product.emi_min_base}`}
            >
              <button
                className="button-solid lg"
                style={{ marginLeft: "10vh" }}
              >
                Continue
              </button>
            </Link>
            <button
              onClick={this.handleCancelReceipt}
              href={`/admin/ContinuePayment?cartId=${
                this.props.cart_id
              }&oneauthId=${this.props.oneauthid}&amountLeft=${this.props
                .amountLeft / 100}&userId=${this.props.userid}&productId=${this.props.product.id}&minBase=${this.props.product.emi_min_base}`}
            >
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ActiveOrders;
