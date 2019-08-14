import React from "react";
import FieldWithElement from "./FieldWithElement";
import Swal from "sweetalert2";
import Router from "next/router";
import Modal from "react-modal";
import Price from "./Price";
import resourcesController from "../controllers/resources";
import refundController from "../controllers/refund";

const customStyles = {
  content: {
    top: "38%",
    left: "50%",
    marginRight: "-50%",
    height: "auto",
    width: "auto",
    transform: "translate(-50%, -50%)"
  }
};
class CompleteOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      centers: [],
      showModal: false,
      paymentMethod: this.props.payment_type,
      formValues: {
        payment_type: "credits",
        user_id: this.props.userid,
        txn_id: this.props.txn_id
      }
    };
  }
  componentDidMount() {
    resourcesController
      .handleGetCenters()
      .then(res => {
        this.setState({
          centers: res.data
        });
      })
      .catch(error => {
        Swal.fire({
          type: "error",
          title: "Unable to fetch centers!",
          text: error
        });
      });
  }

  onChangeValue = e => {
    let newFormValues = this.state.formValues;
    console.log(this.state.formValues.user_id);
    newFormValues[e.target.name] = e.target.value;
    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({
      showModal: false
    });
    Swal.fire({
      title: "Are you sure you want to make a refund?",
      type: "question",
      confirmButtonColor: "#f66",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true
    }).then(result => {
      if (result.value) {
        const data = this.state.formValues;
        refundController
          .handleCreateRefund(data)
          .then(res => {
            Swal.fire({
              title: "Refund has been completed!",
              type: "success",
              timer: 3000,
              showConfirmButton: true,
              confirmButtonText: "Okay"
            });
          })
          .catch(error => {
            Swal.fire({
              title: "Error while making a refund!",
              type: "error",
              text: error
            });
          });
      }
    });
  };

  openModalHandler = () => {
    this.setState({
      showModal: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      showModal: false
    });
  };

  razorpayOption = () => {
    if (this.state.paymentMethod === "razorpay") {
      return <option value="razorpay">Razorpay</option>;
    }
  };
  ModalForm = () => (
    <div>
      <Modal
        isOpen={this.state.showModal}
        onRequestClose={this.closeModalHandler}
        handleSubmit={this.handleSubmit}
        amount={this.props.amount}
        name={this.props.product_name}
        style={customStyles}
      >
        <div className=" col-md-12">
          <div>
            <div className="modal-header">
              <h3>Refund Payment</h3>
              <h3>
                Course Purchased{" "}
                <span className="red">{this.props.product_name}</span>
              </h3>
              <h3>
                Order Total <span className="red">₹ {this.props.amount}</span>
              </h3>
            </div>
            <div className="modal-body">
              <FieldWithElement
                name={"Payment Method"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
                <select name="payment_type" onChange={this.onChangeValue}>
                  <option value="credits">CREDITS</option>
                  <option value="cheque">CHEQUE</option>
                  {this.razorpayOption()}
                  <option value="undisclosed" selected>
                    Select Payment Mode
                  </option>
                </select>
              </FieldWithElement>

              {this.paymentMethod()}

              <FieldWithElement
                name={"Payment Center"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
                <select name="center_id" onChange={this.onChangeValue}>
                  <option value="undisclosed" selected>
                    Select Payment Center
                  </option>
                  {this.state.centers.map(center => {
                    return (
                      <option value={center.id} key={center.id}>
                        {center.name}
                      </option>
                    );
                  })}
                </select>
              </FieldWithElement>
              <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
                <input
                  type="text"
                  className={"input-text"}
                  placeholder="Enter Your Comment"
                  name={"comment"}
                  onChange={this.onChangeValue}
                />
              </FieldWithElement>

              <FieldWithElement nameCols={3} elementCols={9} name={"Amount"}>
                <input
                  type="text"
                  className={"input-text"}
                  placeholder="Enter amount"
                  name={"amount"}
                  onChange={this.onChangeValue}
                />
              </FieldWithElement>
            </div>
            <div className="modal-footer">
              <button
                className="button-solid lg mr-4"
                onClick={this.closeModalHandler}
              >
                CLOSE
              </button>
              <button className="button-solid lg" onClick={this.handleSubmit}>
                REFUND
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );

  paymentMethod = () => {
    if (this.state.formValues.payment_type === "cheque") {
      return (
        <div>
          <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Location"
              name={"cheque_location"}
              onChange={this.onChangeValue}
              value={this.state.formValues.chequeLocation}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Serial Number"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Serial Number"
              name={"serial_number"}
              onChange={this.onChangeValue}
              value={this.state.formValues.serialNumber}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Bank Name"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Bank Name"
              name={"bank_name"}
              onChange={this.onChangeValue}
              value={this.state.formValues.bank}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Branch Name"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Enter Your Branch Name"
              name={"branch_name"}
              onChange={this.onChangeValue}
              value={this.state.formValues.branch}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
            <input
              type="date"
              className={"input-text"}
              placeholder="Select Date"
              name={"cheque_date"}
              onChange={this.onChangeValue}
              value={this.state.formValues.issueDate}
            />
          </FieldWithElement>
          <div className="divider-h mb-5 mt-5" />
        </div>
      );
    } else if (this.state.formValues.payment_type === "credits") {
      return "";
    }
  };

  render() {
    return (
      <div>
        {this.state.showModal ? this.ModalForm() : ""}
        <div className="row justify-content-center p-4">
          <div
            className="border-card pt-4 mb-4"
            style={{ borderColor: "green", borderWidth: ".4vh" }}
          >
            <div className="row justify-content-between align-items-center">
              <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                <div className="col-md-3 col-4 mt-1 mr-5">
                  <img className="round" src={this.props.image} alt="" />
                </div>
                <div className="description justify-content-center">
                  <div>
                    <h4>{this.props.product_name}</h4>
                    <div className="grey font-sm">{this.props.description}</div>
                  </div>
                </div>
              </div>
              <div>
                {/* Payment status:{" "} */}
                {this.props.status === "captured" ? (
                  <div style={{ color: "green", fontSize: "1.5rem" }}>
                    <strong>Paid</strong>
                    <i className="fa fa-check ml-2" aria-hidden="true" />
                  </div>
                ) : (
                  ""
                )}
              </div>

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
            <div className="d-flex justify-content-center mr-5">
              {this.props.partial_payment ? ("") :
                  (
                      <div className={"mr-4"}>
                      <a href={this.props.invoice_url} target="blank">
                      <button className="button-solid lg">View Invoice</button>
                      </a>
                      </div>
                  )
              }
              {this.props.partial_payment ? (
                <a
                  href={`/admin/PartialHistory?userId=${
                    this.props.userid
                  }&cart_id=${this.props.cart_id}`}
                  className="button-solid lg mr-4"
                >
                  View all Transactions
                </a>
              ) : (
                ""
              )}
              {!this.props.partial_payment &&
                      this.props.status === "captured" && this.props.amount !== 0 ? (
                <button
                  className="button-solid lg"
                  onClick={this.openModalHandler}
                >
                  Refund
                </button>
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

export default CompleteOrder;
