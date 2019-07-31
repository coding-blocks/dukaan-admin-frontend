import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../controllers/config";
import Modal from "react-modal";
import moment from "moment";
import controller from "../controllers/purchases";
import Price from "./Price";
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
class PartialPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRefundDetailModal: false,
      centers: [],
      refundDetail: {},
      formValues: {
        txn_id: props.txn_id,
        user_id: props.userid
      }
    };
  }

  componentDidMount() {
    axios
      .get("/api/v2/admin/resources/centers", {
        withCredentials: true
      })
      .then(res => {
        this.setState({ centers: res.data });
      });
  }

  onChangeValue = e => {
    let newFormValues = this.state.formValues;
    newFormValues[e.target.name] = e.target.value;
    this.setState({
      formValues: newFormValues
    });
  };

  closeRefundDetailModal = () => {
    this.setState({
      showRefundDetailModal: false
    });
  };

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

  handleSubmit = async e => {
    e.preventDefault();
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
        var formBody = [];
        for (var property in data) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(data[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        controller
          .handleCreateRefund(formBody)
          .then(response => {
            Swal.fire({
              title: "Refund made!",
              type: "success",
              timer: "30000",
              showConfirmButton: true,
              confirmButtonText: "Okay"
            });
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          })
          .catch(error => {
            Swal.fire({
              title: "Error while making refund!",
              text: error,
              type: "error",
              showConfirmButton: true
            });
          });
      }
    });
  };

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
    } else {
    }
  };

  formDisplay = () => {
    return (
      <div>
        <FieldWithElement
          name={"Payment Method"}
          nameCols={3}
          elementCols={9}
          elementClassName={"pl-4"}
        >
          <select name="payment_type" onChange={this.onChangeValue}>
            <option selected value="undisclosed">
              Select Payment Method
            </option>
            {this.props.mode === "razorpay" ? (
              <option value="razorpay">Razorpay</option>
            ) : (
              ""
            )}
            <option value="credits">Credits</option>
            <option value="cheque">Cheque</option>
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
            placeholder="Enter Comment"
            name={"comment"}
            onChange={this.onChangeValue}
          />
        </FieldWithElement>

        <FieldWithElement nameCols={3} elementCols={9} name={"Amount"}>
          <input
            type="text"
            className={"input-text"}
            placeholder="Enter Amount"
            name={"amount"}
            onChange={this.onChangeValue}
          />
        </FieldWithElement>

        <button
          id="view-invoice"
          className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5"
          type="submit"
          onClick={this.handleSubmit}
        >
          Refund
        </button>
      </div>
    );
  };

  render() {
    return (
      <div className="col-md-4 col-12">
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
              <Price amount={this.state.refundDetail.amount_paid / 100} />
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
        <br />
        <div className="border-card">
          <div className="font-mds mb-3 red">Payment ID: #{this.props.id}</div>
          <div className="divider-h mb-4 mt-4" />
          <p>Payment Mode: {this.props.mode}</p>
          <p>Partial Amount: ₹ {this.props.partial_amount}</p>
          <p>Fee: ₹ {this.props.fee}</p>
          <p>Tax Paid: ₹ {this.props.tax_collected}</p>
          <p>Paid On: {this.props.date}</p>
          <p>Payment Collected By: {this.props.name}</p>
          <p>Payment Center: {this.props.center}</p>
          <p>Payment Status: {this.props.status}</p>
          {this.props.status === "paid" ? (
            this.formDisplay()
          ) : (
            <button
              id="view-invoice"
              className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5"
              type="submit"
              onClick={this.handleRefundDetails}
            >
              Refund Details
            </button>
          )}
          <a href={this.props.partial_invoice_link} target="blank">
            <button
              id="view-invoice"
              className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5"
              type="submit"
            >
              View Invoice
            </button>
          </a>
        </div>
      </div>
    );
  }
}

export default PartialPayments;
