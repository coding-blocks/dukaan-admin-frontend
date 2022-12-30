/**
 * Created by tdevm on 16/10/19.
 */

import React from "react";
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import {Field, Formik} from "formik";
import FieldWithElement from "../../../components/FieldWithElement";
import resourcesController from "../../../controllers/resources";
import userController from "../../../controllers/users"
import ErrorHandler from "../../../helpers/ErrorHandler";
import Swal from "sweetalert2";
import Router from "next/dist/client/router";
import {filterPrimaryAddress} from "../../../helpers/filterPrimaryAddress";

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colleges: [],
            branches: [],
            gradYear: [],
            countries: [],
            addressStates: [],
        };

    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const oneauthId = params.get('oneauthId');
        if (!oneauthId) {
            window.location.href = '/'
        }
        resourcesController.getDemographicsCountriesGradYears().then(([demographics, countries, states, gradYear]) => {
            return Promise.all([
                demographics.data.colleges,
                demographics.data.branches,
                countries.data,
                states.data,
                gradYear,
                userController.getUserByFromOneAuthByOneAuthId(oneauthId)
            ])
        }).then(([colleges, branches, countries, addressStates, gradYear, {data}]) => {
            this.setState({
                colleges,
                branches,
                countries,
                addressStates,
                gradYear,
                userFromOneauth: data,
                primaryAddress: data.demographic.addresses ? filterPrimaryAddress(data.demographic.addresses) : null
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

    renameKeys = (keysMap, obj) => Object
        .keys(obj)
        .reduce((acc, key) => ({
            ...acc,
            ...{[keysMap[key] || key]: obj[key]}
        }), {});


    saveUserDetailsShowingSweetAlert = (formValues) => {
        Swal.fire({
            title: "Save following details?",
            html: `Name : ${
                formValues.firstname
            } ${formValues.lastname}<br/>
             Phone: ${formValues.mobile_number}<br/>
             Address: ${formValues.street_address}
                            ${formValues.landmark} 
                            ${formValues.city}<br/>
             Pin: ${formValues.pincode}<br/>               
             WhatsApp Number: ${formValues.whatsapp_number}`,
            confirmButtonColor: "#f66",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then((result) => {
            if (result.value) {
                userController.updateUserDetails(formValues).then(res => {
                    Swal.fire({
                        title: "User Details Updated!",
                        type: "success",
                        timer: "3000",
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    });
                    Router.push(`/admin/users?oneauthId=${res.data.id}`);
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

    getFormikInitialValues() {
        return {
            label: this.state.primaryAddress ? this.state.primaryAddress.label : "HOME",
            firstName: this.state.userFromOneauth.firstname,
            lastName: this.state.userFromOneauth.lastname,
            gender: this.state.userFromOneauth.gender || "UNDISCLOSED",
            dialCode: this.state.userFromOneauth.mobile_number.substr(0, 3) || null,
            collegeId: this.state.userFromOneauth.demographic.collegeId ? String(this.state.userFromOneauth.demographic.collegeId) : "",
            branchId: this.state.userFromOneauth.demographic.branchId ? String(this.state.userFromOneauth.demographic.branchId) : "",
            mobileNumber: this.state.userFromOneauth.mobile_number.replace('+91-', '') || null,
            gradYear: this.state.userFromOneauth.graduationYear || "2025",
            pincode: this.state.primaryAddress ? this.state.primaryAddress.pincode : "",
            streetAddress: this.state.primaryAddress ? this.state.primaryAddress.street_address : "",
            landmark: this.state.primaryAddress ? this.state.primaryAddress.landmark : "",
            city: this.state.primaryAddress ? this.state.primaryAddress.city : "",
            whatsappNumber: this.state.primaryAddress ? this.state.primaryAddress.whatsapp_number : "",
            stateId: this.state.primaryAddress ? String(this.state.primaryAddress.stateId) : "DL",
            countryId: this.state.primaryAddress ? String(this.state.primaryAddress.countryId) : "IN",
            address_id: this.state.primaryAddress ? String(this.state.primaryAddress.id) : null
        }
    }


    render() {
        if (!this.state.userFromOneauth) {
            return (<div>
                <Head title={"Loading..."}>
                    <Layout>
                        <div className={"d-flex col-8 mt-4 ml-3"}>
                            <h1>Loading...</h1>
                        </div>
                    </Layout>
                </Head>
            </div>)
        }
        return (
            <div>
                <Head title="Edit User | Dukaan"/>
                <Layout>
                    <div className={"d-flex col-8 mt-4 ml-3"}>
                        <div className={"border-card coupon-card "}>
                            {/* Title */}
                            <div className="d-flex justify-content-center">
                                <div/>
                                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                                    <h2 className={"title red"}>Edit user details</h2>
                                </div>
                            </div>
                            <Formik
                                initialValues={this.getFormikInitialValues()}
                                validate={(values) => {
                                    let errors = {};
                                    if (!values.firstName) {
                                        errors.firstName = 'First Name is Required';
                                    }
                                    if (!values.streetAddress) {
                                        errors.streetAddress = 'Address Line 1 is Required';
                                    }
                                    if (!values.landmark) {
                                        errors.landmark = 'Landmark is Required';
                                    }
                                    if (!values.city) {
                                        errors.city = 'City is Required';
                                    }
                                    if (!values.lastName) {
                                        errors.lastName = 'Last Name is required';
                                    }
                                    if (!/^\d{10}$/.test(values.mobileNumber)) {
                                        errors.mobileNumber = `Enter a valid 10 digit phone number`;
                                    }

                                    if (!/^\d{10}$/.test(values.whatsappNumber)) {
                                        errors.whatsappNumber = `Enter a valid 10 digit phone number`;
                                    }
                                    if (!/^\d{6}$/.test(values.pincode)) {
                                        errors.pincode = `Enter a valid 6 digit pincode`;
                                    }
                                    return errors;
                                }}
                                onSubmit={(values, {setSubmitting}) => {
                                    const keysMap = {
                                        firstName: 'firstname',
                                        lastName: 'lastname',
                                        dialCode: 'dial_code',
                                        mobileNumber: 'mobile_number',
                                        whatsappNumber: 'whatsapp_number',
                                        streetAddress: 'street_address'
                                    };
                                    values.oneauthId = this.state.userFromOneauth.id
                                    this.saveUserDetailsShowingSweetAlert(this.renameKeys(keysMap, values))
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
                                    <form id="edit_user_form" onSubmit={handleSubmit}>

                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"Username"}>
                                            <p className={"input-text"}>
                                                {this.state.userFromOneauth.username}
                                            </p>
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


                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"Email"}>
                                            <p className={"input-text"}>
                                                {this.state.userFromOneauth.email}
                                            </p>
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
                                                <option value="MALE">
                                                    Male
                                                </option>
                                                <option value="FEMALE">Female</option>
                                                <option value="UNDISCLOSED">Undisclosed</option>
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

                                        {/* mobileNumber */}
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
                                                id="collegeId"
                                                name="collegeId"
                                                onChange={handleChange}
                                                value={values.collegeId}
                                            >
                                                {this.state.colleges.map((college, index) => {
                                                    return <option key={college.id}
                                                                   value={college.id}>{college.name}</option>;
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
                                                id="branchId"
                                                name="branchId"
                                                onChange={handleChange}
                                                value={values.branchId}
                                            >
                                                {this.state.branches.map((branch, index) => {
                                                    return <option key={branch.id}
                                                                   value={branch.id}>{branch.name}</option>;
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
                                                id="gradYear"
                                                name="gradYear"
                                                onChange={handleChange}
                                                value={values.gradYear}
                                            >
                                                {this.state.gradYear.map((year, index) => {
                                                    return <option key={year} value={year}>{year}</option>;
                                                })}
                                            </select>
                                        </FieldWithElement>

                                        <FieldWithElement>
                                            <div className={"d-flex justify-content-right mt-1 pb-4"}>
                                                <h2 className={"title red"}>User Address</h2>
                                            </div>
                                        </FieldWithElement>


                                        {/* Address line 1 */}
                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"Address Line 1"}
                                            errors={errors.streetAddress}
                                            errorColor={'tomato'}
                                        >
                                            <input
                                                type="text"
                                                className={"input-text"}
                                                placeholder="Street address"
                                                name="streetAddress"
                                                onChange={handleChange}
                                                value={values.streetAddress}
                                                required
                                            />
                                        </FieldWithElement>

                                        {/* landmark */}
                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"Landmark"}
                                            errors={errors.landmark}
                                            errorColor={'tomato'}
                                        >
                                            <input
                                                type="text"
                                                className={"input-text"}
                                                placeholder="Landmark"
                                                name="landmark"
                                                onChange={handleChange}
                                                value={values.landmark}
                                                required
                                            />
                                        </FieldWithElement>

                                        {/* city */}
                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"City"}
                                            errors={errors.city}
                                            errorColor={'tomato'}
                                        >
                                            <input
                                                type="text"
                                                className={"input-text"}
                                                placeholder="City"
                                                name="city"
                                                onChange={handleChange}
                                                value={values.city}
                                                required
                                            />
                                        </FieldWithElement>

                                        {/* address state */}
                                        <FieldWithElement
                                            name={"State"}
                                            nameCols={3}
                                            elementCols={9}
                                            elementClassName={"pl-4 "}
                                        >
                                            <select
                                                id="stateId"
                                                name="stateId"
                                                onChange={handleChange}
                                                required
                                                value={values.stateId}
                                            >
                                                {this.state.addressStates.map((state, index) => {
                                                    return (
                                                        <option value={state.state_code} key={state.id}>
                                                            {state.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </FieldWithElement>

                                        {/* address country */}
                                        <FieldWithElement
                                            name={"Country"}
                                            nameCols={3}
                                            elementCols={9}
                                            elementClassName={"pl-4 "}
                                        >
                                            <select
                                                id="countryId"
                                                name="countryId"
                                                onChange={handleChange}
                                                required
                                                value={values.countryId}
                                            >
                                                {this.state.countries.map((country, index) => {
                                                    return (
                                                        <option value={country.country_code} key={country.id}>
                                                            {country.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </FieldWithElement>

                                        {/* pincode */}
                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"Pin Code"}
                                            errors={errors.pincode}
                                            errorColor={'tomato'}>
                                            <input
                                                type="tel"
                                                className={"input-text"}
                                                placeholder="Area Pincode"
                                                name="pincode"
                                                onChange={handleChange}
                                                style={{backgroundColor: "#f6f6f6"}}
                                                value={values.pincode}
                                                pattern={"[0-9]{6}"}
                                                required
                                            />
                                        </FieldWithElement>

                                        {/* whatsappNumber */}
                                        <FieldWithElement
                                            nameCols={3}
                                            elementCols={9}
                                            name={"WhatsApp Number"}
                                            errors={errors.whatsappNumber}
                                            errorColor={'tomato'}
                                        >
                                            <input
                                                type="tel"
                                                className={"input-text fab fa-whatsapp"}
                                                placeholder="WhatsApp Number"
                                                name="whatsappNumber"
                                                onChange={handleChange}
                                                style={{backgroundColor: "#f6f6f6"}}
                                                value={values.whatsappNumber}
                                                pattern={"[0-9]{10}"}
                                                required
                                            />
                                        </FieldWithElement>


                                        <div className={"d-flex justify-content-center"}>
                                            <button
                                                id="search"
                                                type="submit"
                                                className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                            >
                                                Update details
                                            </button>
                                        </div>
                                    </form>
                                )}

                            </Formik>
                        </div>
                    </div>
                </Layout>
            </div>

        );
    }
}

export default EditUser;
