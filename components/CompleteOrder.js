import React from "react";
import Modal from "./Modal";
import FieldWithElement from "./FieldWithElement";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

class CompleteOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      paymentMethod: this.props.payment_type,
      formValues: {
        payment_type: "credits",
        user_id: this.props.userid,
        txn_id: this.props.txn_id
      }
    };
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
      title: "Are you sure you want to make a new payment?",
      type: "question",
      confirmButtonColor: "#f66",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true
    }).then(result => {
      if (result.value) {
        // Confirmation passed, delete coupon.
        const data = this.state.formValues;
        var formBody = [];
        for (var property in data) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(data[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        axios
          .post("http://localhost:2929/api/v2/admin/refunds", formBody, {
            withCredentials: true
          })
          .then(() => {
            console.log("Im in then");
            Swal.fire({
              title: "payment made!",
              type: "success",
              timer: "3000",
              showConfirmButton: true,
              confirmButtonText: "Okay"
            });
          })
          .catch(err => {
            console.log(err);
            Swal.fire({
              title: "Error while making payment!",
              type: "error",
              showConfirmButton: true
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
    <Modal
      className="modal"
      show={this.state.isShowing}
      close={this.closeModalHandler}
      handleSubmit={this.handleSubmit}
    >
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
        name={"Center"}
        nameCols={3}
        elementCols={9}
        elementClassName={"pl-4"}
      >
        <select name="center_id" onChange={this.onChangeValue}>
          <option value="1">Pitampura</option>
          <option value="2">Noida</option>
          <option value="undisclosed" selected>
            Select Center
          </option>
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
    </Modal>
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
          <div className="border-card pt-4 mb-4">
            <div className="row justify-content-between align-items-center">
              <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
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
                <div className="font-sm grey">
                  Purchased on {this.props.date}
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <a href={this.props.invoice_url} target="blank">
                <button className="button-solid lg">View Invoice</button>
              </a>
              {this.props.status === "captured" ? (
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
