import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import axios from "axios";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        username: "test1",
        firstname: "test1",
        lastname: "test1",
        gender: "male",
        dial_code: "+91",
        mobile_number: "+91-2222222222",
        collegeId: "1",
        branchId: "1",
        gradYear: "2020",
        email: "e@e.com"
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
            <h2 className={"title"}>Create User</h2>
          </div>

          {/* username */}
          <FieldWithElement nameCols={3} elementCols={9} name={"Username"}>
            <input
              type="text"
              className={"input-text icon user-bg"}
              placeholder="Username"
              name={"username"}
              onChange={this.onChangeValue}
              value={this.state.formValues.username}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Firstname"}>
            <input
              type="text"
              className={"input-text icon lines-bg"}
              placeholder="First Name"
              name={"firstname"}
              onChange={this.onChangeValue}
              value={this.state.formValues.firstname}
            />
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Lastname"}>
            <input
              type="text"
              className={"input-text icon lines-bg"}
              placeholder="Last Name"
              name={"lastname"}
              onChange={this.onChangeValue}
              value={this.state.formValues.lastname}
            />
          </FieldWithElement>

          {/* gender */}
          <FieldWithElement
            name={"Gender"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="gender"
              name="gender"
              onChange={this.onChangeValue}
              value={this.state.formValues.gender}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="undisclosed" selected>
                Undisclosed
              </option>
            </select>
          </FieldWithElement>

          {/* code */}
          <FieldWithElement
            name={"Dial Code"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4 "}
          >
            <select
              id="dial_code"
              name="dial_code"
              onChange={this.onChangeValue}
              value={this.state.formValues.dial_code}
            >
              <option value="">Select Code</option>
              <option value="+91">+91</option>
            </select>
          </FieldWithElement>

          <FieldWithElement nameCols={3} elementCols={9} name={"Mobile Number"}>
            <input
              type="text"
              className={"input-text"}
              placeholder="Mobile Number"
              name={"mobile_number"}
              onChange={this.onChangeValue}
              style={{ backgroundColor: "#f6f6f6" }}
              value={this.state.formValues.mobile_number}
            />
          </FieldWithElement>

          {/* Colleges */}
          <FieldWithElement
            name={"College"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="college"
              name="collegeId"
              onChange={this.onChangeValue}
              value={this.state.formValues.collegeId}
            >
              <option selected value="">
                All Colleges
              </option>
              <option value="1">List of colleges</option>
            </select>
          </FieldWithElement>

          {/* {Courses} */}
          <FieldWithElement
            name={"Branch / Course"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="branch_courses"
              name="branchId"
              onChange={this.onChangeValue}
              value={this.state.formValues.branchId}
            >
              <option selected value="">
                All Courses
              </option>
              <option value="1">List of courses</option>
            </select>
          </FieldWithElement>

          {/* graduation year */}
          <FieldWithElement
            name={"Graduation Year"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <select
              id="grad_year"
              name="gradYear"
              onChange={this.onChangeValue}
              value={this.state.formValues.gradYear}
            >
              <option selected value="">
                Select Graduation Year
              </option>
              <option value="2019">List Of Years</option>
            </select>
          </FieldWithElement>

          {/* email */}
          <FieldWithElement
            name={"Email"}
            nameCols={3}
            elementCols={9}
            elementClassName={"pl-4"}
          >
            <input
              type="text"
              className={"input-text icon mail-bg"}
              placeholder="Email Address"
              name="email"
              onChange={this.onChangeValue}
              value={this.state.formValues.email}
            />
          </FieldWithElement>

          <div className={"d-flex justify-content-center"}>
            <button
              id="search"
              className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
              onClick={this.handleSubmit}
            >
              Create User
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUser;
