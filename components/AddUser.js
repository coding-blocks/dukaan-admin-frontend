import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import Swal from "sweetalert2";
import resourcesController from "../controllers/resources";
import usersController from "../controllers/users";
import ErrorHandler from '../helpers/ErrorHandler';
import Router from "next/router";

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
                gender: "male",
                dial_code: "+91",
                collegeId: "1",
                branchId: "1",
                mobile_number: "",
                email: "",
                gradYear: "2026"
            }
        };
    }

    componentDidMount() {
        resourcesController.getDemographicsCountriesGradYear().then(([demographics, countries, gradYear]) => {
            this.setState({
                colleges: demographics.data.colleges,
                branches: demographics.data.branches,
                countries: countries.data,
                gradYear
            });
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error fetching resources!",
                text: error
            });
        });
    }

    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
            formValues: newFormValues
        });
    };

    /**
     * Custom validations method for the add user form
     * @return {boolean} – if the validation passed or not
     */
    customValidations = () => {
        if (!document.getElementById("add_user_form").checkValidity()) {
            document.getElementById("add_user_form").reportValidity();
            return false;
        } else {
            return true;
        }
    };

    handleSubmit = async e => {
        e.preventDefault();
        if (this.customValidations()) {
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
                    usersController
                        .handleAddUser(data)
                        .then(res => {
                            Swal.fire({
                                title: "User added!",
                                type: "success",
                                timer: "3000",
                                showConfirmButton: true,
                                confirmButtonText: "Okay"
                            });
                            // Reset the form
                            let formValues = this.state.formValues;
                            Object.keys(formValues).map(key => {
                                formValues[key] = "";
                            });
                            formValues.gender = "male";
                            formValues.dial_code = "+91";
                            formValues.gradYear = "2026";
                            formValues.collegeId = "1";
                            formValues.branchId = "1";
                            this.setState({
                                formValues
                            });
                            Router.push(`/admin/orders?id=${res.data.id}`);
                        })
                        .catch(error => {
                            Swal.fire({
                                title: "Error while adding user!",
                                type: "error",
                                text: error
                            });
                        });
                }
            });
        }
    };

    render() {
        return (
            <div className={"d-flex col-8 mt-4 ml-3"}>
                <div className={"border-card coupon-card "}>
                    {/* Title */}
                    <div className="d-flex justify-content-center">
                        <div/>
                        <div className={"d-flex justify-content-center mt-1 pb-3"}>
                            <h2 className={"title red"}>Create New User</h2>
                        </div>
                    </div>
                    <form id="add_user_form">
                        {/* username */}
                        <FieldWithElement nameCols={3} elementCols={9} name={"Username"}>
                            <input
                                type="text"
                                className={"input-text icon user-bg"}
                                placeholder="Username"
                                name={"username"}
                                onChange={this.onChangeValue}
                                value={this.state.formValues.username}
                                required
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
                                required
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
                                required
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
                                required
                            >
                                <option value="male">
                                    Male
                                </option>
                                <option value="female">Female</option>
                                <option value="undisclosed">Undisclosed</option>
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
                                required
                            >
                                {this.state.countries.map((country, index)=> {
                                    if (country.dial_code === "+91") {
                                        return (
                                            <option value={country.dial_code} key={country.id} selected >
                                                {country.name} {`(${country.dial_code})`}
                                            </option>
                                        );
                                    } else {
                                        return (
                                            <option value={country.dial_code} key={country.id}>
                                                {country.name} {`(${country.dial_code})`}
                                            </option>
                                        );
                                    }
                                })}
                            </select>
                        </FieldWithElement>

                        <FieldWithElement
                            nameCols={3}
                            elementCols={9}
                            name={"Mobile Number"}
                        >
                            <input
                                type="text"
                                className={"input-text"}
                                placeholder="Mobile Number"
                                name={"mobile_number"}
                                onChange={this.onChangeValue}
                                style={{backgroundColor: "#f6f6f6"}}
                                value={this.state.formValues.mobile_number}
                                pattern={"[0-9]{10}"}
                                title="Mobile number can only be 10 digits"
                                required
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
                                {this.state.colleges.map((college, index) => {
                                    return <option key={college.id} value={college.id}>{college.name}</option>;
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
                                {this.state.branches.map((branch, index) => {
                                    return <option key={branch.id} value={branch.id}>{branch.name}</option>;
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
                                {this.state.gradYear.map((year, index) => {
                                    return <option key={year} value={year}>{year}</option>;
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
                                type="email"
                                className={"input-text icon mail-bg"}
                                placeholder="Email Address"
                                name="email"
                                onChange={this.onChangeValue}
                                value={this.state.formValues.email}
                                required
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
                    </form>
                </div>
            </div>
        );
    }
}

export default AddUser;
