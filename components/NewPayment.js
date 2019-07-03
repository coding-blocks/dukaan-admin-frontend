import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import axios from "axios";

class NewPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        course_center: "",
        course: "",
        state: "",
        payment_center: "",
        coupon_code: "",
        comment: "",
        amount: "",
        method: ""
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
      "http://localhost:2929/api/v2/admin/users",
      formBody,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "dukaan-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNsaWVudE5hbWUiOiJvbmxpbmVDYiIsIm9uZWF1dGhJZCI6MTQ1OSwicHJvZHVjdElkIjoxNTYsInF1YW50aXR5IjoxfSwiaWF0IjoxNTYwMjQwNzkwfQ.x6pSdQA2bQndnnMoxSgwn6GdKiPmm82E8AE2BPIPRRQ"
        }
      }
    );
    console.log(response);
    this.setState({
      formValues: {}
    });
  };

  render() {
    return (
      <div className={"d-flex align-items-center col-md-8"}>
        <div className={"border-card coupon-card "}>
          {/* Title */}
          <div className={"d-flex justify-content-center mt-1 pb-3"}>
            <h2 className={"title red"}>Make New Payment</h2>
          </div>

          {/* username */}
          <FieldWithElement
            name={"Select Center For Course"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="center_for_course"
              name="course_center"
              onChange={this.onChangeValue}
              value={this.state.formValues.gender}
            >
              <option value="male">Pitampura</option>
              <option value="female">Noida</option>
              <option value="undisclosed" selected>
                Select Center
              </option>
            </select>
          </FieldWithElement>

          <FieldWithElement
            name={"Select Course"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="course"
              name="course"
              onChange={this.onChangeValue}
              value={this.state.formValues.gender}
            >
              <option value="male">Android at Rs 2000</option>
              <option value="female">NodeJS at Rs 2000</option>
              <option value="undisclosed" selected>
                Select Course
              </option>
            </select>
          </FieldWithElement>

          <FieldWithElement
            name={"Selling State"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="state"
              name="state"
              onChange={this.onChangeValue}
              value={this.state.formValues.gender}
            >
              <option value="male">Assam</option>
              <option value="female">Delhi</option>
              <option value="undisclosed" selected>
                Select State
              </option>
            </select>
          </FieldWithElement>
          <div className="divider-h mb-5 mt-5" />
          {/* gender */}
          <FieldWithElement
            name={"Payment Center"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="payment_center"
              name="payment_center"
              onChange={this.onChangeValue}
              value={this.state.formValues.gender}
            >
              <option value="male">Pitampura</option>
              <option value="female">Noida</option>
              <option value="undisclosed" selected>
                Select Payment Center
              </option>
            </select>
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={4} name={"Coupon Code"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Coupon Code"
              name={"coupon_code"}
              onChange={this.onChangeValue}
              value={this.state.formValues.mobile_number}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Write Your Comment Here"
              name={"comment"}
              onChange={this.onChangeValue}
              value={this.state.formValues.mobile_number}
            />
          </FieldWithElement>

          <FieldWithElement
            className="red"
            nameCols={3}
            elementCols={9}
            name={"Total Amount (Rs) = (Price - Discount - Credits) + Tax :"}
          >
            <input
              type="text"
              className={"input-text"}
              name={"amount"}
              onChange={this.onChangeValue}
              value={this.state.formValues.mobile_number}
            />
          </FieldWithElement>

          <div className={"d-flex"}>
            <button
              id="search"
              className={"button-solid mb-2 mt-4 pl-5 pr-5"}
              onClick={this.handleSubmit}
            >
              Calculate Amount
            </button>
          </div>
          <div className="divider-h mb-5 mt-5" />

          {/* code */}

          {/* Colleges */}
          <FieldWithElement
            name={"Choose Payment Method"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="method"
              name="method"
              onChange={this.onChangeValue}
              value={this.state.formValues.collegeId}
            >
              <option selected value="">
                CASH
              </option>
              <option value="1">NEFT</option>
              <option value="1">CHEQUE</option>
              <option value="1">SWIPE</option>
            </select>
          </FieldWithElement>

          <FieldWithElement
            name={"Partial Payment"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <div className="mt-2">
              <label
                className="input-checkbox checkbox-tick font-sm"
                for="tick"
              >
                <input type="checkbox" id="tick" /> Click For Partial Payment
                <span />
              </label>
            </div>
          </FieldWithElement>

          <div className={"d-flex justify-content-center"}>
            <button
              id="search"
              className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
              onClick={this.handleSubmit}
            >
              Record Payment
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default NewPayment;
