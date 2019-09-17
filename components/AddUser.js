import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import Swal from "sweetalert2";
import resourcesController from "../controllers/resources";
import usersController from "../controllers/users";
import ErrorHandler from '../helpers/ErrorHandler';
import Router from "next/router";
import {Formik, Field} from 'formik';

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colleges: [],
            branches: [],
            gradYear: [],
            countries: [],
            usernameAvailable: null
        };
    }

    componentDidMount() {
        resourcesController.getDemographicsCountriesGradYears().then(([demographics, countries, gradYear]) => {
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


    validateUsername = username => {
        if (username.length > 3)
            return usersController.getUsernameAvailability(username).then((response) => {
            }).catch((err) => {
                if (err.response.data.status === 422)
                    return err.response.data.message
            })
    };


    renameKeys = (keysMap, obj) => Object
        .keys(obj)
        .reduce((acc, key) => ({
            ...acc,
            ...{[keysMap[key] || key]: obj[key]}
        }), {});

    submitFormShowingSweetAlert = (formValues) => {
        Swal.fire({
            title: "Create new user?",
            html: `Username: ${formValues.username}<br/>Name : ${
                formValues.firstname
            } ${formValues.lastname}<br/> Phone: ${
                formValues.mobile_number
            }<br/>Email Id: ${formValues.email}<br/>`,
            confirmButtonColor: "#f66",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                usersController.handleAddUser(formValues).then(res => {
                    Swal.fire({
                        title: "User added!",
                        type: "success",
                        timer: "3000",
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    });
                    Router.push(`/admin/orders?id=${res.data.id}`);
                }).catch(error => {
                    Swal.fire({
                        title: "Error while adding user!",
                        type: "error",
                        text: error
                    });
                });
            }
        });
    }

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
                    <Formik
                        initialValues={{
                            username: "",
                            firstName: "",
                            lastName: "",
                            gender: "male",
                            dialCode: "+91",
                            collegeId: "1",
                            branchId: "1",
                            mobileNumber: "",
                            email: "",
                            gradYear: "2026"
                        }}
                        validate={(values) => {
                            let errors = {};
                            if (!values.email) {
                                errors.email = 'Email is required';
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                                errors.email = 'Invalid email address';
                            }
                            if (!values.firstName) {
                                errors.firstName = 'First Name is Required';
                            }
                            if (!values.username) {
                                errors.username = 'Username is Required';
                            }
                            if (!values.lastName) {
                                errors.lastName = 'Last Name is required';
                            }
                            if (!/^\d{10}$/.test(values.mobileNumber)) {
                                errors.mobileNumber = `Enter a valid 10 digit phone number`;
                            }
                            return errors;
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            const keysMap = {
                                firstName: 'firstname',
                                lastName: 'lastname',
                                dialCode: 'dial_code',
                                mobileNumber: 'mobile_number'
                            };
                            this.submitFormShowingSweetAlert(this.renameKeys(keysMap, values))
                        }}
                    >
                        {({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                          }) => (
                            <form id="add_user_form" onSubmit={handleSubmit}>
                                {/* username */}
                                <FieldWithElement
                                    nameCols={3}
                                    elementCols={9}
                                    name={"Username"}
                                    errorColor={'tomato'}
                                    errors={errors.username}>
                                    <Field
                                        name={"username"}
                                        required type={"text"}
                                        className={"input-text icon user-bg"}
                                        placeholder="Username"
                                        onChange={handleChange}
                                        value={values.username}
                                        validate={this.validateUsername}
                                    />
                                </FieldWithElement>

                                <FieldWithElement
                                    nameCols={3}
                                    elementCols={9}
                                    name={"First Name"}
                                    errors={errors.firstName}
                                    errorColor={'tomato'}
                                >
                                    <input
                                        type="text"
                                        className={"input-text icon lines-bg"}
                                        placeholder="First Name"
                                        name="firstName"
                                        onChange={handleChange}
                                        value={values.firstName}
                                        required
                                    />
                                </FieldWithElement>

                                <FieldWithElement
                                    nameCols={3}
                                    elementCols={9}
                                    name={"Last Name"}
                                    errors={errors.lastName}
                                    errorColor={'tomato'}
                                >
                                    <input
                                        type="text"
                                        className={"input-text icon lines-bg"}
                                        placeholder="Last Name"
                                        name="lastName"
                                        onChange={handleChange}
                                        value={values.lastName}
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
                                        onChange={handleChange}
                                        value={values.gender}
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
                                        id="dialCode"
                                        name="dialCode"
                                        onChange={handleChange}
                                        required
                                        value={values.dialCode}
                                    >
                                        {this.state.countries.map((country, index) => {
                                            return (
                                                <option value={country.dial_code} key={country.id}>
                                                    {country.name} {`(${country.dial_code})`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FieldWithElement>

                                <FieldWithElement
                                    nameCols={3}
                                    elementCols={9}
                                    name={"Mobile Number"}
                                    errors={errors.mobileNumber}
                                    errorColor={'tomato'}
                                >
                                    <input
                                        type="tel"
                                        className={"input-text"}
                                        placeholder="Mobile Number"
                                        name="mobileNumber"
                                        onChange={handleChange}
                                        style={{backgroundColor: "#f6f6f6"}}
                                        value={values.mobileNumber}
                                        pattern={"[0-9]{10}"}
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
                                        onChange={handleChange}
                                        value={values.collegeId}
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
                                        onChange={handleChange}
                                        value={values.branchId}
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
                                    errors={errors.email}
                                    errorColor={'tomato'}
                                >
                                    <input
                                        type="email"
                                        className={"input-text icon mail-bg"}
                                        placeholder="Email Address"
                                        name="email"
                                        onChange={handleChange}
                                        value={values.email}
                                        required
                                    />
                                </FieldWithElement>

                                <div className={"d-flex justify-content-center"}>
                                    <button
                                        id="search"
                                        type="submit"
                                        className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        )}

                    </Formik>
                </div>
            </div>
        );
    }
}

export default AddUser;
