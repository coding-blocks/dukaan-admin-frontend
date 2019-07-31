import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      colleges: [],
      branches: [],
      gradYear: [],
      countries: [],
      formValues: {
        username: "",
        firstname: "",
        lastname: "",
        gender: "",
        dial_code: "+91",
        collegeId: "",
        branchId: "",
        mobile_number: "",
        email: "",
        gradYear: "2026"
      }
    };
  }

  componentDidMount() {
    Promise.all([
      axios.get("http://localhost:2929/api/v2/admin/resources/demographics", {
        withCredentials: true
      }),
      axios.get("http://localhost:2929/api/v2/admin/resources/countries", {
        withCredentials: true
      })
    ]).then(([res1, res2]) => {
      console.log(res1.data);
      console.log(res2.data);
      this.setState({
        colleges: res1.data.colleges,
        branches: res1.data.branches,
        countries: res2.data
      });
    });

    let gradYear = [];
    for (let i = 2026; i >= 2000; i--) {
      gradYear.push(i.toString());
    }
    this.setState({
      gradYear
    });
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
    Swal.fire({
      title: "Are you sure you want to add a user?",
      type: "question",
      html: `Username: ${this.state.formValues.username}<br/>Name : ${
        this.state.formValues.firstname
      } ${this.state.formValues.lastname}<br/> Phone: ${
        this.state.formValues.mobile_number
      }<br/>Email Id: ${this.state.formValues.email}<br/>`,
      confirmButtonColor: "#f66",
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true
    }).then(result => {
      if (result.value) {
        // Confirmation passed
        const data = this.state.formValues;
        var formBody = [];
        for (var property in data) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(data[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        axios
          .post("http://localhost:2929/api/v2/admin/users", formBody, {
            withCredentials: true
          })
          .then(() => {
            Swal.fire({
              title: "User added!",
              type: "success",
              timer: "3000",
              showConfirmButton: true,
              confirmButtonText: "Okay"
            });
            this.setState({
              formValues: {
                username: "",
                firstname: "",
                lastname: "",
                gender: "",
                dial_code: "",
                collegeId: "",
                branchId: "",
                mobile_number: "",
                email: ""
              }
            });
            setTimeout(() => {
              window.location.reload("/");
            }, 3000);
          })
          .catch(err => {
            Swal.fire({
              title: "Error while adding user!",
              type: "error",
              showConfirmButton: true
            });
          });
      }
    });
  };

  render() {
    return (
      <div className={"d-flex align-items-center col-12"}>
        <div className={"border-card coupon-card "}>
          {/* Title */}
          <div className={"d-flex justify-content-center mt-1 pb-3"}>
            <h2 className={"title red"}>Create User</h2>
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
            >
              {this.state.countries.map(country => {
                if (country.dial_code === "+91") {
                  return (
                    <option value={country.dial_code} selected>
                      {country.name} {`(${country.dial_code})`}
                    </option>
                  );
                } else {
                  return (
                    <option value={country.dial_code}>
                      {country.name} {`(${country.dial_code})`}
                    </option>
                  );
                }
              })}
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
              {this.state.colleges.map(college => {
                return <option value={college.id}>{college.name}</option>;
              })}
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
              {this.state.branches.map(branch => {
                return <option value={branch.id}>{branch.name}</option>;
              })}
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
            >
              {this.state.gradYear.map(year => {
                return <option value={year}>{year}</option>;
              })}
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
