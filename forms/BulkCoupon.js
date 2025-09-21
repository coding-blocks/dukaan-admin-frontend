import React from 'react';
import { Formik, Field } from 'formik';
import DatePicker from "react-datepicker";
import * as Yup from 'yup';
import FieldWithElement from '../components/FieldWithElement';
import * as controller from '../controllers/v2/couponsV2'
import Swal from 'sweetalert2';
import config from "../config";
import Tooltip from '@material-ui/core/Tooltip';

const bulkCouponSchema = Yup.object().shape({
    authority_doc: Yup.string().min(3)
        .required('Description is required'),
    number_of_coupons: Yup.number()
        .min(1, 'Must be greater or equals to 1')
        .required('No of coupons is required.'),
    code_length: Yup.number()
        .min(10, 'Must be greater or equals to 10')
        .required('code length is required.'),
    starts_with: Yup.string()
        .min(2, 'must be greater or equals to 2')
        .max(10, 'must be less or equals to 10')
        .nullable().notRequired(),
    ends_with: Yup.string()
        .min(2, 'must be greater or equals to 2')
        .max(10, 'must be less or equals to 10')
        .nullable().notRequired(),
    category: Yup.string()
        .required('Category is required'),
    sub_category_id: Yup.number()
        .typeError('Sub Category is required')
        .required('Sub Category is required'),
    organization_id: Yup.number()
        .required('Organization is required'),
    mode: Yup.string()
        .required('Mode is required'),
    left: Yup.number()
        .required('Field is required'),
    amount: Yup.number().when('mode', {
        is: (val) => val == "flat",
        then: Yup.number().min(1)
            .typeError('Discount is required')
            .required('Discount is required'),
        otherwise: Yup.number().nullable().notRequired()
    }),
    percentage: Yup.number().when('mode', {
        is: (val) => val == "percentage",
        then: Yup.number().min(1).max(100)
            .typeError('Percentage is required')
            .required('Percentage is required'),
        otherwise: Yup.number().nullable().notRequired()
    }),
    max_discount: Yup.number().when('mode', {
        is: (val) => val == "percentage",
        then: Yup.number().min(1)
            .nullable().notRequired(),
        otherwise: Yup.number().nullable().notRequired()
    }),
    applicable_all_users: Yup.boolean()
        .required("Field is required."),
    active: Yup.boolean()
        .required("Field is required."),
    min_product_mrp: Yup.number()
        .positive().nullable().notRequired(),
    max_product_mrp: Yup.number()
        .positive()
        .max(Number.MAX_SAFE_INTEGER, 'entered value to large')
        .moreThan(Yup.ref('min_product_mrp'), 
            "must be greater than min product mrp")
        .nullable().notRequired(),
    cashback: Yup.number()
        .min(1).max(100)
        .nullable().notRequired()
});

const initialValues = {
    organization_id: 1,
    authority_doc: "",
    number_of_coupons: 2,
    code_length: 10,
    type: "online",
    mode: "flat",
    left: 1,
    category: "",
    sub_category_id: null,
    active: false,
    applicable_all_users: true,
    percentage: null,
    max_discount: null,
    amount: null,
    starts_with: '',
    ends_with: '',
    valid_start: Date.now(),
    valid_end: new Date().setMonth(new Date().getMonth() + 1),
    min_product_mrp: null,
    max_product_mrp: null,
    cashback: null
}

class BulkCouponForm extends React.Component {

    constructor(props) {
        super(props)
    }

    getCouponProductIds = () => {
        const couponProductsWithProuctTypeId = this.props.data.couponProducts
        const products = Object.values(couponProductsWithProuctTypeId).flat()
        return products.map(p => p.id)
    }

    onSubmit = async (fields) => {
        fields.products = await this.getCouponProductIds()
        controller.handleAddBulkCoupons(fields).then((response) => {
            Swal.fire({
                title: "Coupon added successfully!",
                type: "success",
                showConfirmButton: true
            }).then(() => {
                // window.location = `${config.domain}/admin/coupons2`;
            });
        }).catch((error) => {
            Swal.fire({
                title: "Error adding coupons!",
                text: error,
                type: "error",
                showConfirmButton: true
            });
        });
    }

    render() {
        return (
            <div>
                <div className={"border-card coupon-card col-md-9 offset-2 mt-5 mb-5"}>
                    {
                    <Formik initialValues={initialValues} validationSchema={bulkCouponSchema} onSubmit={this.onSubmit}>
                        {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, setFieldTouched}) => (

                            <form onSubmit={handleSubmit}>
                                <div className={"add-coupon-card"}>

                                    {/* organization */}
                                    <FieldWithElement name={"Organization"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <select
                                            id="organization_id"
                                            name="organization_id"
                                            onBlur={handleBlur}
                                            value={values.organization_id}
                                            onChange={(e) => {

                                                if (Object.keys(this.props.data.couponProducts).length !== 0) {
                                                    this.props.onUnsavedChanges()
                                                    return;
                                                }

                                                handleChange(e)
                                                this.props.onOrganizationChange(e)
                                            }}
                                        >
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
                                    <FieldWithElement name={"Number of Coupons*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.number_of_coupons && errors.number_of_coupons}>
                                        <input
                                            type="number"
                                            className="input-text"
                                            placeholder="Enter Code"
                                            name="number_of_coupons"
                                            value={values.number_of_coupons}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FieldWithElement>

                                    {/* Length of code */}
                                    <FieldWithElement name={"Total Code Length*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.code_length && errors.code_length}>
                                        <input
                                            type="number"
                                            className="input-text"
                                            placeholder="Enter Length of code"
                                            name="code_length"
                                            value={values.code_length}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FieldWithElement>

                                    {/* Prepend */}
                                    <FieldWithElement name={"Starts with"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.starts_with && errors.starts_with}>
                                        <input
                                            type="text"
                                            className="input-text"
                                            placeholder="Enter text to prepend"
                                            name="starts_with"
                                            value={values.starts_with}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FieldWithElement>

                                    {/* Append */}
                                    <FieldWithElement name={"Ends with"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.ends_with && errors.ends_with}>
                                        <input
                                            type="text"
                                            className="input-text"
                                            placeholder="Enter text to append"
                                            name="ends_with"
                                            value={values.ends_with}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FieldWithElement>

                                    {/* Authority_code */}
                                    <FieldWithElement name={"Description"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.authority_doc && errors.authority_doc}>
                                        <textarea
                                            type="text"
                                            className="input-textarea"
                                            placeholder="Enter Description"
                                            name="authority_doc"
                                            rows="3"
                                            value={values.authority_doc}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                    </FieldWithElement>

                                    {/* Categories */}
                                    <FieldWithElement name={"Category"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.category && errors.category}>
                                        <select
                                            id="category"
                                            name="category"
                                            onBlur={handleBlur}
                                            value={values.category}
                                            onChange={() => {
                                                setFieldValue("category", this.props.handleCategoryChange(event))
                                                setFieldValue("sub_category_id", "")
                                                setFieldTouched("sub_category_id", false)
                                             }}
                                        >
                                            <option value="" key="">Select</option>
                                            <option value="special_discount">Special Discount</option>
                                            <option value="campaign">Campaign</option>
                                        </select>
                                    </FieldWithElement>


                                {/* Sub Category */}
                                    <FieldWithElement name={"Sub Category"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.sub_category_id && errors.sub_category_id}>
                                        <select
                                            id="sub_category_id"
                                            name="sub_category_id"
                                            onBlur={handleBlur}
                                            onChange={() => {
                                                setFieldValue("sub_category_id", this.props.handleSubCategoryChange(event, values.category))
                                            }}
                                            value={values.sub_category_id}
                                        >
                                            <option value="" key="">Select</option>
                                            {
                                                this.props.data.subCategories.map((subcategory) => {
                                                    return (
                                                        <option value={Number(subcategory.id)}
                                                                key={Number(subcategory.id)}>
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
                                            minDate={new Date()}
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
                                            minDate={new Date(values.valid_start).setDate(new Date(values.valid_start).getDate() + 1)}
                                            onChange={date => setFieldValue('valid_end', date)}
                                            timeCaption="time"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            selected={values.valid_end}
                                        />
                                    </FieldWithElement>

                                    {/* Mode */}
                                    <FieldWithElement name={"Mode*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.mode && errors.mode}>
                                        <select
                                            id="mode"
                                            name="mode"
                                            onBlur={handleBlur}
                                            value={values.mode}
                                            onChange={() => {
                                                setFieldValue("mode", event.target.value)
                                                setFieldValue("amount", null)
                                                setFieldTouched("amount", false)
                                                setFieldValue("percentage", null)
                                                setFieldTouched("percentage", false)
                                                setFieldValue("max_discount", null)
                                                setFieldTouched("max_discount", false)
                                                setFieldValue("cashback", null)
                                                setFieldTouched("cashback", false)
                                             }}
                                        >
                                            <option value="flat">Flat</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </FieldWithElement>

                                    {values.mode == "flat" &&
                                    /* Amount */
                                    <FieldWithElement name={"Discount*"} nameCols={3} elementCols={9} 
                                                      elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.amount && errors.amount}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Enter discount value"
                                            name="amount"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.amount}
                                        />
                                    </FieldWithElement>
                                    }

                                    {values.mode == "percentage" &&
                                        <div>
                                            <FieldWithElement name={"Percentage*    "} nameCols={3} elementCols={9} 
                                                              elementClassName={"pl-4"} errorColor={'tomato'}
                                                              errors={touched.percentage && errors.percentage}>
                                                <input
                                                    type="number"
                                                    className={"input-text"}
                                                    placeholder="Enter Percentage"
                                                    name="percentage"
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleChange(e)
                                                        if (e.target.value == 100)
                                                            setFieldValue("cashback" , "")
                                                    }}
                                                    value={values.percentage}
                                                />
                                            </FieldWithElement>

                                            <FieldWithElement
                                                name={"Max discount"} nameCols={3} elementCols={9} 
                                                elementClassName={"pl-4"} errorColor={'tomato'} 
                                                errors={touched.max_discount && errors.max_discount}>
                                                <input
                                                    type="number"
                                                    className={"input-text"}
                                                    placeholder="Enter Max Discount Applicable"
                                                    name="max_discount"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.max_discount}
                                                />
                                            </FieldWithElement>

                                            <FieldWithElement
                                                name={"cashback(%)"} nameCols={3} elementCols={9} 
                                                elementClassName={"pl-4"} errorColor={'tomato'} 
                                                errors={touched.cashback && errors.cashback}>

                                                <Tooltip title={<span className={"mui-tooltip"}>% of product price to be added as cashback</span>} 
                                                placement="bottom-end">
                                                    <input
                                                        type="number"
                                                        className={"input-text"}
                                                        id={values.percentage === 100 ? "disabled-cashback" : "cashback"}
                                                        placeholder="Enter cashback"
                                                        name="cashback"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.cashback}
                                                    />
                                                </Tooltip>
                                            </FieldWithElement>

                                        </div>
                                    }

                                    <FieldWithElement
                                            name={"Min product Mrp"} nameCols={3} elementCols={9} 
                                            elementClassName={"pl-4"} errorColor={'tomato'} 
                                            errors={touched.min_product_mrp && errors.min_product_mrp}>
                                            <input
                                                type="number"
                                                className={"input-text"}
                                                placeholder="Enter min product mrp"
                                                name="min_product_mrp"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.min_product_mrp}
                                            />
                                    </FieldWithElement>

                                    <FieldWithElement
                                            name={"Max product Mrp"} nameCols={3} elementCols={9} 
                                            elementClassName={"pl-4"} errorColor={'tomato'} 
                                            errors={touched.max_product_mrp && errors.max_product_mrp}>
                                            <input
                                                type="number"
                                                className={"input-text"}
                                                placeholder="Enter max product mrp"
                                                name="max_product_mrp"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values.max_product_mrp}
                                            />
                                    </FieldWithElement>

                                    

                                    {/* Total number of times a coupon can be used*/}
                                    <FieldWithElement name={"How many times it can be used?"} nameCols={6}
                                                      elementCols={6} elementClassName={"pl-4"} errorColor={'tomato'}
                                                      errors={touched.left && errors.left}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Enter Left"
                                            name="left"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.left}
                                            min={1}
                                            title="Left can only have numbers"
                                        />
                                    </FieldWithElement>

                                    {/* Active */}
                                    <div className={"mt-3 row d-flex"}>
                                        <div className={"col-md-6"}>
                                            <span class="text">Activate</span>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <input
                                                name="active"
                                                className={"ml-4 mt-3"}
                                                type="checkbox"
                                                checked={values.active}
                                                value={values.active}
                                                onChange={() => {
                                                    setFieldValue("active", !values.active)
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* All User */}
                                    <div className={"mt-3 row d-flex"}>
                                        <div className={"col-md-6"}>
                                            <span className="text">Applicable for All Users?</span>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <input
                                                name="applicable_all_users"
                                                className={"ml-4 mt-3"}
                                                type="checkbox"
                                                checked={values.applicable_all_users}
                                                onChange={() => {
                                                    setFieldValue("applicable_all_users", !values.applicable_all_users)
                                                }}
                                                value={values.applicable_all_users}
                                                disabled={"true"}
                                            />
                                        </div>
                                    </div>

                                    <div className={"d-flex justify-content-center"}>
                                        <button
                                            id="submit_bulk_btn"
                                            type="submit"
                                            className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                    }
                </div>
            </div>
        )
    }
}

export default BulkCouponForm
