import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import axios from "axios";

class PartialPayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        txn_id: props.txn_id,
        user_id: props.userid
      }
    };
  }

  onChangeValue = e => {
    let newFormValues = this.state.formValues;
    newFormValues[e.target.name] = e.target.value;
    this.setState({
      formValues: newFormValues
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const data = this.state.formValues;

    var formBody = [];
    for (var property in data) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(data[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await axios.post(
      "http://localhost:2929/api/v2/admin/refunds",
      formBody,
      { withCredentials: true }
    );
    console.log(response);
  };

  render() {
    const paymentMethod = () => {
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

            <FieldWithElement
              nameCols={3}
              elementCols={9}
              name={"Serial Number"}
            >
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
    return (
      <div className="col-md-4 col-12">
        <h3 className="mb-2">Payment Details</h3>
        <div className="font-sm no-gutters">
          <div>{this.props.Productname}</div>
          <div>Order Total ₹ {this.props.mrp}</div>
        </div>
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
          {paymentMethod()}
          <FieldWithElement
            name={"Payment Center"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select name="center_id" onChange={this.onChangeValue}>
              <option value="1">Pitampura</option>
              <option value="2">Noida</option>
              <option value="undisclosed" selected>
                Select Payment Center
              </option>
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
