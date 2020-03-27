import React from 'react';
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/coupons';
import "../../../styles/pages/admin/coupons.scss";
import ProductsChooser from '../../../components/ProductsChooser';
import DatePicker from "react-datepicker";
import * as moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";
class EditCoupon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            queryParams: props.coupon,
            couponInfo: props.coupon,
            errorMessage: ''
        };
    }

    componentWillMount() {
        this.setState({
            queryParams: this.props.coupon || {},
            couponInfo: this.props.coupon || {}
        });
    }

    /**
     * Callback function for ProductsChooser component that updates
     * them in the state when ProductsChooser returns an array of
     * products added
     * @param {array} products – Array of with the names of products
     */
    handleProductsChange = (products) => {
        let queryParams = this.state.queryParams;
        queryParams['products'] = products;
        this.setState({
            queryParams
        })
    }

    /**
     * Changes the value of the specified key in the queryParams object
     * in state.
     * @param {SyntheticEvent} event – Handles an event from a form
     * @example
     *  <input
     *   type="text"
     *   name="email"
     *   onChange={this.handleQueryParamChange}
     *  />
     *  // Changes the value of this.state.queryParams.email
     */
    handleQueryParamChange = (event) => {
        let newQueryParams = this.state.queryParams;
        newQueryParams[event.target.name] = event.target.value;
        this.setState(prevState => ({
            queryParams: newQueryParams
        }));
    };

    /**
     * Custom Validations for the edit form
     * @return {boolean} isValid – Returns a bool that tells
     *  if the form passed validation
     */
    customValidations = () => {
        // No Duplicate Products in ProductChooser
        let products = this.state.queryParams.products;
        if (products.length !== new Set(products).size) {
            this.setState({
                'errorMessage': "You have added the same product multiple times! \
         Please make sure that each product is only added once."
            });
            return false;
        }
        return true;
    }

    setStartDate = (date) => {
        const queryParams = {...this.state.queryParams}
        queryParams.valid_start = date
        this.setState({queryParams})
    }

    setEndDate = (date) => {
        const queryParams = {...this.state.queryParams}
        queryParams.valid_end = date
        this.setState({queryParams})
    }


    /**
     * Method to handle saving of coupon
     */
    handleSaveCoupon = (e) => {
        e.preventDefault();
        if (!document.getElementById("editCouponForm").checkValidity()) {
            document.getElementById("editCouponForm").reportValidity();
        } else {
            if (this.customValidations()) {
                this.setState({
                    loading: true,
                    errorMessage: ''
                });
                const couponPayload = {
                    organization_id: 1,
                    ...this.state.queryParams,
                    max_discount: this.state.couponInfo.max_discount ? this.state.couponInfo.max_discount : null
                }
                controller.handleEditCoupon(couponPayload, this.state.queryParams.id).then((response) => {
                    if (response) {
                        this.setState({
                            loading: false,
                            errorMessage: ''
                        });
                        this.props.callback(this.state.queryParams);
                    }
                }).catch((error) => {
                    this.setState({
                        loading: false,
                        errorMessage: error.toString()
                    });
                });
            }
        }
    }

    render() {
        return (
            <div>
                <div className={"d-flex align-items-center justify-content-center"}>
                    <div className={"coupon-card col-md-12 mt-5"}>
                        {this.state.loading &&
                        <Loader/>
                        }
                        {!this.state.loading &&
                        <div className={"edit-coupon-card"}>

                            {/* Title */}
                            <div className={"d-flex justify-content-center mt-1 pb-3"}>
                                <h2 className={"title"}>Edit Coupon</h2>
                            </div>
                            {this.state.errorMessage.length != 0 &&
                            <div className={"d-flex red justify-content-center mt-1 pb-3"}>
                                {this.state.errorMessage}
                            </div>
                            }
                            <form id="editCouponForm">
                                {/* Code */}
                                <FieldWithElement name={"Code"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                    <input
                                        type="text"
                                        className={"input-text"}
                                        placeholder="Enter Code"
                                        name="code"
                                        value={this.state.couponInfo.code}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    />
                                </FieldWithElement>

                                {/* Categories */}
                                <FieldWithElement name={"Category"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <select
                                        id="category"
                                        name="category"
                                        value={this.state.couponInfo.category}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    >
                                        <option value="referral">Referral</option>
                                        <option value="campus_ambassador">Campus Ambassador</option>
                                        <option value="campaign">Campaign</option>
                                        <option value="special_discount">Special Discount</option>
                                    </select>
                                </FieldWithElement>

                                {this.state.queryParams.category == 'referral' &&
                                /* Cashback */
                                <FieldWithElement name={"Cashback"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <input
                                        type="text"
                                        className="input-text"
                                        placeholder="Enter Referrer Cashback"
                                        name="referrer_cashback"
                                        pattern="[0-9]{1,10}"
                                        title="Cashback must be a number"
                                        value={this.state.couponInfo.referrer_cashback}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    />
                                </FieldWithElement>

                                    /* Referrer */}
                                {this.state.queryParams.category == 'referral' &&
                                <FieldWithElement name={"Referrer"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <input
                                        type="text"
                                        className="input-text"
                                        placeholder="Enter Referrer ID"
                                        name="referrer"
                                        pattern="[0-9]{1,10}"
                                        title="Referrer must be a User's ID"
                                        value={this.state.couponInfo.referrer}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    />
                                </FieldWithElement>
                                }

                                {/* Mode */}
                                <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                    <select
                                        id="mode"
                                        name="mode"
                                        value={this.state.couponInfo.mode}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    >
                                        <option value="flat">Flat</option>
                                        <option value="percentage">Percentage</option>
                                    </select>
                                </FieldWithElement>

                                {this.state.couponInfo.mode === "flat" &&

                                (<FieldWithElement name={"Amount"} nameCols={3} elementCols={9}
                                                   elementClassName={"pl-4"}>
                                    <input
                                        type="number"
                                        className="input-text"
                                        placeholder="Enter Amount"
                                        name="amount"
                                        pattern="[0-9]{3,10}"
                                        title="Amount can only have 3 to 10 digit numbers"
                                        value={this.state.couponInfo.amount}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    />
                                </FieldWithElement>)}

                                {this.state.couponInfo.mode === "percentage" &&
                                (<div>
                                    <FieldWithElement name={"Percentage"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <input
                                            type="number"
                                            className="input-text"
                                            placeholder="Enter Amount"
                                            name="percentage"
                                            pattern="[0-9]{1,3}"
                                            title="Amount can only have 3 to 10 digit numbers"
                                            value={this.state.couponInfo.percentage}
                                            onChange={this.handleQueryParamChange}
                                            required
                                        />
                                        <FieldWithElement
                                            name={"Max discount"}
                                            nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                            <input
                                                type="number"
                                                className={"input-text"}
                                                placeholder="Enter Max Discount Applicable"
                                                name="max_discount"
                                                value={this.state.couponInfo.max_discount ? this.state.couponInfo.max_discount : null}
                                                onChange={this.handleQueryParamChange}
                                            />
                                        </FieldWithElement>

                                    </FieldWithElement>
                                </div>)
                                }
                                {/* Left */}
                                <FieldWithElement name={"Left"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                    <input
                                        type="number"
                                        className="input-text"
                                        placeholder="Enter Left"
                                        name="left"
                                        value={this.state.couponInfo.left}
                                        pattern="[0-9]{1,10}"
                                        title="Left can only have numbers"
                                        onChange={this.handleQueryParamChange}
                                        required
                                    />
                                </FieldWithElement>

                                {/* Products */}
                                <FieldWithElement name={"Products"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <ProductsChooser
                                        products={this.state.couponInfo.products}
                                        productsCallback={this.handleProductsChange}
                                        productType = {'course'}
                                        organizationId={this.state.couponInfo.organization_id}
                                        multiple={true}
                                    />
                                </FieldWithElement>


                                {/* Start Date */}
                                <FieldWithElement name={"Validity Start Date"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <DatePicker
                                        showTimeSelect
                                        timeFormat="HH:mm:ss"
                                        timeIntervals={60}
                                        timeCaption="time"
                                        minDate ={new Date()}
                                        onChange={this.setStartDate}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        selected={new Date(this.state.queryParams.valid_start)}
                                    />
                                </FieldWithElement>

                                {/* End Date */}
                                <FieldWithElement name={"Validity End Date"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <DatePicker
                                        showTimeSelect
                                        timeFormat="HH:mm:ss"
                                        timeIntervals={60}
                                        minDate ={new Date()}
                                        onChange={this.setEndDate}
                                        timeCaption="time"
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        selected={new Date(this.state.queryParams.valid_end)}
                                    />
                                </FieldWithElement>


                                {/* Active */}
                                <FieldWithElement name={"Active"} nameCols={3} elementCols={9}
                                                  elementClassName={"pl-4"}>
                                    <select
                                        id="active"
                                        name="active"
                                        value={this.state.couponInfo.active}
                                        onChange={this.handleQueryParamChange}
                                        required
                                    >
                                        <option value="true">True</option>
                                        <option value="false">False</option>
                                    </select>
                                </FieldWithElement>
                                <div className={"d-flex justify-content-center"}>
                                    <button
                                        id="search"
                                        className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                        onClick={this.handleSaveCoupon}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default EditCoupon;
