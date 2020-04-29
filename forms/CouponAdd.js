import React from 'react'
import FieldWithElement from '../components/FieldWithElement';
import DatePicker from "react-datepicker";
import {Formik} from 'formik';
import * as controller from '../controllers/v2/couponsV2'
import ErrorHandler from "../helpers/ErrorHandler";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";

const	FormikContext = React.createContext({});


class AddCouponForm extends React.Component {

	constructor(props) {
		super(props)
	}

	setRandomCouponCode = (event) => {
        return controller.generateRandomCouponCode()
	}

    render() {
        return (
            <div>
            	<div className={"border-card coupon-card col-md-9 offset-2 mt-5 mb-5"}>
	            	<Formik
                        initialValues={{
                            authority_doc: "",
			                code: "",
			                organization_id: 1,
			                type: "online",
			                mode: "flat",
			                left: 1,
			                category: "",
			                sub_category: null,
			                active: false,
			                applicable_all_user: false,
			                max_discount: null,
			                user_id: null,
			                valid_start: new Date(),
			                valid_end: new Date().setMonth(new Date().getMonth() + 1)
                        }}
                        validate={(values) => {
                            let errors = {};
                            if (!values.authority_doc) {
                                errors.email = 'Description is required';
                            } 
                            if (!values.code) {
                                errors.firstName = 'Code is Required';
                            }
                            if (!values.organization_id) {
                                errors.streetAddress = 'Organization is Required';
                            }
                            if (!values.category) {
                                errors.landmark = 'category is Required';
                            }
                            if (!values.sub_category) {
                                errors.city = 'Sub Category is Required';
                            }
                            if (!values.valid_start) {
                                errors.username = 'Start Date is Required';
                            }
                            if (!values.valid_end) {
                                errors.lastName = 'End Date is required';
                            }
                            if (!values.mode) {
                                errors.lastName = 'Mode is required';
                            }
                            if (!values.max_discount) {
                                errors.lastName = 'Discount is required';
                            }
                            
                            return errors;
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            const keysMap = {
                                authority_doc: 'authority_doc',
                                code: 'code',
                                organization_id: 'organization_id',
                                type: 'type',
                                mode: 'mode',
                                left: 'left',
                                category: 'category',
                                sub_category: 'sub_category',
                                active: 'active',
                                applicable_all_user: 'applicable_all_user',
                                max_discount: 'max_discount',
                                user_id: 'user_id',
                                valid_start: 'valid_start',
                                valid_end: 'valid_end'
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
                              setFieldValue,
                              getFieldValue
                          }) => (

                          		<form id="addCouponForm" onSubmit={(e) => e.preventDefault()}>
			                    <div className={"add-coupon-card"}>
			                        {/* organization */}
			                        <FieldWithElement name={"Organization"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <select
			                                id="organization_id"
			                                name="organization_id"
			                                onChange={handleChange}
	                                        value={values.organization_id}
			                                required>
			                                {
			                                    this.props.data.organizations.map((organization) => {
			                                        return (
			                                            <option value={Number(organization.id)} key={organization.id}>
			                                                {organization.name}
			                                            </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                        {/* Code */}
			                        <FieldWithElement name={"Code*"} nameCols={3} elementCols={9}
			                                        elementClassName={"pl-4"}  errorColor={'tomato'}
                                    				errors={errors.username}>
			                            <input
			                                type="text"
			                                id="code"
			                                className="input-text"
			                                placeholder="Enter Code"
			                                name="code"
			                                value={values.code}
			                                onChange={handleChange}
			                                required
			                            />
			                            <span id="random_coupon" className="red pull-right mt-1"
			                                            onClick={() => setFieldValue("code", this.setRandomCouponCode())}>
			                            	Generate Random Code
			                            </span>
			                        </FieldWithElement>

			                        {/* Authority_code */}
			                        <FieldWithElement name={"Description*"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <textarea
			                                type="text"
			                                className="input-textarea"
			                                placeholder="Enter Description"
			                                name="authority_doc"
			                                rows="4"
			                                value={values.authority_doc}
			                                onChange={handleChange}
			                                required
			                            />
			                        </FieldWithElement>

			                        {/* Categories */}
			                        <FieldWithElement name={"Category"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <select
			                                id="category"
			                                name="category"
			                                onChange={() => setFieldValue("category", this.props.handleCategoryChange(event))}
			                                value={values.category}>
			                                {
			                                    this.props.data.categories.map((category) => {
			                                        return (
			                                            <option value={category}>
			                                                {category}
			                                            </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                         {/* Sub Categories */}
			                        <FieldWithElement name={"Sub Category"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <select
			                                id="sub_category"
			                                name="sub_category"
			                                onChange={() => setFieldValue("sub_category", this.props.handleSubCategoryChange(event, values.category))}
			                            	required>
			                            	{
			                                    this.props.data.subCategories.map((subcategory) => {
			                                        return (
				                                        <option value={Number(subcategory.id)} key={subcategory.id}>
				                                            {subcategory.name}
				                                        </option>)
			                                    })
			                                }
			                            </select>
			                        </FieldWithElement>

			                        {/* Start Date */}
			                        <FieldWithElement name={"Start Date"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <DatePicker
			                                showTimeSelect
			                                timeFormat="HH:mm:ss"
			                                timeIntervals={60}
			                                timeCaption="time"
			                                minDate ={new Date()}
			                                onChange={date => setFieldValue('valid_start', date)}
			                                dateFormat="MMMM d, yyyy h:mm aa"
			                                selected={values.valid_start}
			                            />
			                        </FieldWithElement>

			                        {/* End Date */}
			                        <FieldWithElement name={"End Date"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <DatePicker
			                                showTimeSelect
			                                timeFormat="HH:mm:ss"
			                                timeIntervals={60}
			                                minDate ={new Date()}
			                                onChange={date => setFieldValue('valid_end', date)}
			                                timeCaption="time"
			                                dateFormat="MMMM d, yyyy h:mm aa"
			                                selected={values.valid_end}
			                            />
			                        </FieldWithElement>

			                        {/* Mode */}
			                        <FieldWithElement name={"Mode*"} nameCols={3} elementCols={9}
			                                          elementClassName={"pl-4"}>
			                            <select
			                                id="mode"
			                                name="mode"
			                                onChange={handleChange}
			                                value={values.mode}
			                                >
			                                <option value="flat">Flat</option>
			                                <option value="percentage">Percentage</option>
			                            </select>
			                        </FieldWithElement>

			                        {values.mode == "flat" &&
			                        /* Amount */
			                        <FieldWithElement
			                            name={"Discount*"}
			                            nameCols={3} elementCols={9} elementClassName={"pl-4"}>
			                            <input
			                                type="number"
			                                className={"input-text"}
			                                placeholder="Enter discount value"
			                                name="amount"
			                                onChange={handleChange}
			                                value={values.amount}
			                            />
			                        </FieldWithElement>
			                        }

			                        {values.mode == "percentage" &&
			                        /* Percentage */
			                        <div>
			                            <FieldWithElement
			                                name={"Percentage*"}
			                                nameCols={3} elementCols={9} elementClassName={"pl-4"}>
			                                <input
			                                    type="text"
			                                    className={"input-text"}
			                                    placeholder="Enter Percentage"
			                                    name="percentage"
			                                    onChange={handleChange}
			                                    value={values.percentage}
			                                />
			                            </FieldWithElement>

			                            <FieldWithElement
			                                name={"Max discount"}
			                                nameCols={3} elementCols={9} elementClassName={"pl-4"}>
			                                <input
			                                    type="text"
			                                    className={"input-text"}
			                                    placeholder="Enter Max Discount Applicable"
			                                    name="max_discount"
			                                    onChange={handleChange}
			                                    value={values.max_discount}
			                                />
			                            </FieldWithElement>
			                        </div>
			                        }

			                         {/* Total number of times a coupon can be used*/}
			                        <FieldWithElement name={"How many times it can be used?*"} nameCols={6}
			                                          elementCols={6} elementClassName={"pl-4"}>
			                            <input
			                                type="number"
			                                className={"input-text"}
			                                placeholder="Enter Left"
			                                name="left"
			                                onChange={handleChange}
			                                value={values.left}
			                                min={1}
			                                title="Left can only have numbers"
			                                required
			                            />
			                        </FieldWithElement>

			                        {/* All User */}
				                    <div className={"mt-3 row d-flex"}>
				                        <div className={"col-md-6"}>
				                            <span className="text">Applicable for All Users?</span>
				                        </div>
				                        <div className={"col-md-6"}>
				                            <input
				                            	name="applicable_all_user"
				                                className={"ml-4 mt-3"}
				                                type="checkbox"
			                                	onChange={() => setFieldValue("applicable_all_user", !values.applicable_all_user )}
				                                values={values.applicable_all_user}
				                                name="applicable_all_user"/>
				                        </div>
				                    </div>

				                   {/* Users field if appicable_all_users- false */}


				                   <div className={"d-flex justify-content-center"}>
                                        <button
                                            id="submit_btn"
                                            className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                        >
                                            Add
                                        </button>
                                    </div>

			                    </div>
			                </form>
                        )}
                    </Formik>
            	</div>
            </div>
        )
    }
}

export default AddCouponForm
