import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import "../DukaanAPI";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Price from "../components/Price";
import formatter from "../helpers/formatter";
import purchasesController from "../controllers/purchases";
import resourcesController from "../controllers/resources";
import productsController from "../controllers/products";
import productCategoriesController from "../controllers/productcategories";
import ChequeFields from "./partialComponents/ChequePaymentFields";
import SwipeFields from "./partialComponents/SwipePaymentFields";
import {Formik} from "formik";
import ErrorHandler from "../helpers/ErrorHandler";
import NeftFields from "./partialComponents/NeftPaymentFields";

class NewPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedProduct: null,
            amountToPay: 0,
            selectedUser: {},
            states: [],
            product_categories: [],
            products: [],
            product_category: "",
            amount: "",
            min_emi: "",
            centers: [],
            id: props.id,
            formValues: {
                coupon: "",
                comment: "",
                paymentMode: "cash",
                quantity: "1",
                stateId: "AP",
                oneauthId: "" + props.userid
            }
        };
        this.ReactSwal = withReactContent(Swal);
    }

    componentDidMount() {
        Promise.all([
            resourcesController.getStates(),
            productCategoriesController.handleGetAllProductCategories(),
            resourcesController.getCenters()
        ]).then(([states, productCategories, centers]) => {
            this.setState({
                selectedUser: this.props.selectedUser,
                showOrders: this.props.showOrders,
                centers: centers.data,
                states: states.data,
                product_categories: productCategories.data
            });
        }).catch(error => {
            ErrorHandler.handle(error);
            Swal.fire({
                type: "error",
                title: "Error fetching data!",
                text: error
            });
        })
    }

    calculateAmount = () => {
        if (this.state.formValues.productId) {
            productsController.handleCalculatePrice({
                coupon: this.state.formValues.coupon.toUpperCase(),
                oneauthId: this.props.userid,
                productId: this.state.formValues.productId,
                quantity: this.state.formValues.quantity
            }).then((res) => {
                if (res.data.amount >= 0 && res.data.couponApplied) {
                    this.setState({
                        amount: formatter.paisaToRs(res.data.amount)
                    });
                    return Swal.fire({
                        type: "success",
                        title: `Coupon ${this.state.formValues.coupon.toUpperCase()} applied successfully! \n Amount to pay ₹${formatter.paisaToRs(res.data.amount)}`
                    });
                } else if (res.data.amount >= 0 && !res.data.couponApplied && this.state.formValues.coupon) {
                    this.setState({
                        amount: formatter.paisaToRs(res.data.amount)
                    });
                    return Swal.fire({
                        type: "error",
                        title: `Coupon ${this.state.formValues.coupon.toUpperCase()} not applied \n Amount to pay ₹${formatter.paisaToRs(res.data.amount)}`
                    });
                } else if (res.data.amount >= 0 && !res.data.couponApplied && !this.state.formValues.coupon) {
                    this.setState({
                        amount: formatter.paisaToRs(res.data.amount)
                    });
                }
            }).catch(error => {
                return Swal.fire({
                    type: "error",
                    text: error,
                    title: "Error calculating price!"
                });
            });
        } else {

        }

    };

    handleProductCategoryChange = e => {
        this.setState({
            product_category: e.target.value
        });
        productsController.handleGetProducts({
                product_category_id: e.target.value
            }, {
                page: 1,
                limit: 100
            }
        ).then((response) => {
            this.setState({
                products: response.results,
                amountToPay: response.results[0] ? response.results[0].list_price : 0,
                selectedProduct: response.results ? response.results[0] : {}
            });
        })
    };

    handleProductChange = e => {
        this.setState({
            selectedProduct: JSON.parse(e.target.selectedOptions[0].dataset.product),
            amountToPay: JSON.parse(e.target.selectedOptions[0].dataset.product).list_price
        })
    }

    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
            formValues: newFormValues
        });
    };

    onChangeHandler = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        let min_emi = e.target.selectedOptions[0].dataset.emi / 100;
        this.setState({
            min_emi: min_emi,
            formValues: newFormValues
        });
    };

    toggleCheck = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.checked;

        this.setState({
            formValues: newFormValues
        });
    };

    /**
     * Custom Validations for the new payment form
     * @return {boolean} isValid – Returns a bool that tells
     *  if the form passed validation
     */
    customValidations = () => {
        if (!document.getElementById("new_payment_form").checkValidity()) {
            document.getElementById("new_payment_form").reportValidity();
            return false;
        }
        if (this.state.min_emi > this.state.formValues.partialAmount) {
            Swal.fire({
                title: "Error adding new payment!",
                text: `Partial payment cannot be less than ${this.state.min_emi}`,
                type: "error"
            });
            return false;
        }
        return true;
    };

    handleSubmit = async e => {
        e.preventDefault();
        const id = this.state.id;
        if (!this.state.formValues.partialPayment) {
            delete this.state.formValues.partialAmount;
        }
        if (this.customValidations()) {
            Swal.fire({
                title: "Are you sure you want to make a new payment?",
                type: "question",
                confirmButtonColor: "#f66",
                confirmButtonText: "Yes!",
                cancelButtonText: "No!",
                showCancelButton: true,
                showConfirmButton: true,
                showCloseButton: true
            }).then(result => {
                if (result.value) {
                    // Confirmation passed, delete coupon.
                    purchasesController.handleCreateNewPurchase(this.state.formValues).then(() => {
                        Swal.fire({
                            title: "Payment has been recorded successfully!",
                            type: "success",
                            timer: "3000",
                            showConfirmButton: true,
                            confirmButtonText: "Okay"
                        });
                        this.props.showOrders(this.state.selectedUser);
                    }).catch(err => {
                        Swal.fire({
                            title: "Error while making payment!",
                            text: err,
                            type: "error",
                            showConfirmButton: true
                        });
                    });
                }
            });
        }
    };

    PaymentMethod = () => {
        if (this.state.formValues.paymentMode === "cheque") {
            return <ChequeFields/>
        } else if (this.state.formValues.paymentMode === "neft") {
            return <NeftFields/>
        } else if (this.state.formValues.paymentMode === "swipe") {
            return <SwipeFields/>
        } else {
            return <div/>;
        }
    };

    formikOnSubmit = (values) => {
        alert('Bhag')
    }

    getFormikInitialValues = () => {
        return {
            coupon: "ddd",
            stateId: "DL",
            comment: "",
            partialPayment: false,
            partialAmount: ""
        }
    }

    formikValidate = (values) => {
        let errors = {};

        return errors
    }

    render() {
        return (
            <div className={"d-flex align-items-center col-md-8"}>
                <Formik initialValues = {this.getFormikInitialValues()}
                        validate = {(values) => {
                            return this.formikValidate(values)
                        }}
                        onSubmit = {(values, {setSubmitting}) => {
                           return this.formikOnSubmit(values)
                        }}>

                    {({   values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting
                    }) => (
                        <form id="new_payment_form" onSubmit={handleSubmit}>
                            <div className={"border-card coupon-card "}>
                                {/* Title */}
                                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                                    <h2 className={"title red"}>Make New Payment</h2>
                                </div>

                                {/* Course category*/}
                                <FieldWithElement
                                    name={"Select course category"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <select
                                        name="product_category"
                                        defaultValue={"select"}
                                        onChange={this.handleProductCategoryChange}
                                        required>
                                        <option value="select" disabled={true}>
                                            Select Category
                                        </option>
                                        {this.state.product_categories.map(category => (
                                            <option value={category.id} key={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </FieldWithElement>

                                {/* Course*/}
                                <FieldWithElement
                                    name={"Select course"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <select
                                        id="productId"
                                        name="productId"
                                        required
                                        defaultValue={"select"}
                                        onChange={this.handleProductChange}>
                                        {this.state.products.map(product => {
                                            return (
                                                <option
                                                    data-product={JSON.stringify(product)}
                                                    value={product.id}
                                                    key={product.id}
                                                >
                                                    {product.description} at{" "}
                                                    {formatter.formatCurrency(product.mrp)}
                                                </option>
                                            );
                                        })}
                                    </select>


                                </FieldWithElement>


                                {/* State */}
                                <FieldWithElement
                                    name={"Select selling state"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <select
                                        name="stateId"
                                        id="stateId"
                                        onChange={handleChange}
                                        value={values.stateId}>

                                        {this.state.states.map((state, index) => {
                                            return (
                                                <option value={state.state_code} key={state.id}>
                                                    {state.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FieldWithElement>

                                <div className="divider-h mb-5 mt-5"/>


                                {/* Payment center */}
                                <FieldWithElement
                                    name={"Select payment Center"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <select
                                        name="paymentCenterId"
                                        required
                                        defaultValue={"select"}
                                        onChange={this.onChangeValue}>
                                        <option value="select" disabled={true}>
                                            Select Payment Center
                                        </option>
                                        {this.state.centers.map(center => {
                                            return (
                                                <option value={center.id} key={center.id}>
                                                    {center.name}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </FieldWithElement>

                                {/* Coupon code*/}
                                <FieldWithElement
                                    nameCols={3}
                                    elementCols={4} name={"Coupon Code"}
                                    errors={errors.coupon}
                                    errorColor={'tomato'}>
                                    <input
                                        type="text"
                                        className={"input-text"}
                                        placeholder="Add a coupon code"
                                        name={"coupon"}
                                        onChange={handleChange}
                                        value={values.coupon}
                                    />
                                </FieldWithElement>

                                {/* Total Amount */}
                                <FieldWithElement
                                    className="red"
                                    nameCols={3}
                                    elementCols={4}
                                    name={"Total Amount (Rs.) = (Price - Discount - Credits) + Tax :"}>
                                    <Price amount={this.state.amountToPay}/>
                                </FieldWithElement>

                                <div className="divider-h mb-5 mt-5"/>

                                <FieldWithElement
                                    name={"Choose Payment Method"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <select name="paymentMode" onChange={this.onChangeValue}>
                                        <option value="cash">
                                            CASH
                                        </option>
                                        <option value="neft">NEFT</option>
                                        <option value="cheque">CHEQUE</option>
                                        <option value="swipe">SWIPE</option>
                                    </select>
                                </FieldWithElement>
                                <div className="divider-h mb-5 mt-5"/>
                                {this.PaymentMethod()}

                                <FieldWithElement
                                    name={"Partial Payment"}
                                    nameCols={3}
                                    elementCols={9}
                                    elementClassName={"pl-4"}>
                                    <div className="mt-2">
                                        <label
                                            className="input-checkbox checkbox-tick font-sm"
                                            htmlFor="tick"
                                            value={this.state.partial_checked}>
                                            <input
                                                type="checkbox"
                                                id="tick"
                                                defaultValue={this.state.formValues.partialPayment}
                                                name="partialPayment"
                                                onChange={this.toggleCheck}
                                            />{" "}
                                            Make this payment partial?
                                            <span/>
                                        </label>
                                    </div>
                                </FieldWithElement>





                                {this.state.formValues.partialPayment ? (
                                    <FieldWithElement
                                        className="red"
                                        nameCols={3}
                                        elementCols={9}
                                        name={"Partial Amount (Rs.)"}>
                                        <input
                                            type="text"
                                            className={"input-text"}
                                            name={"partialAmount"}
                                            onChange={this.onChangeValue}
                                            value={this.state.formValues.partialAmount}
                                            pattern={"[0-9]{1,10}"}
                                            required={this.state.formValues.partialPayment}
                                            title={"Partial amount can only be in numbers"}
                                        />
                                        <span className="red">
                  Partial amount cannot be less than Rs. {this.state.min_emi}
                </span>
                                    </FieldWithElement>
                                ) : (
                                    ""
                                )}

                                {/* Payment comments */}
                                <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
                                    <input
                                        type="text"
                                        className={"input-text"}
                                        placeholder="Place a comment"
                                        name={"comment"}
                                        onChange={this.onChangeValue}
                                        value={values.comment}
                                    />
                                </FieldWithElement>

                                <div className={"d-flex justify-content-center"}>
                                    <button
                                        id="search"
                                        type = "submit"
                                        className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}>
                                        Record Payment
                                    </button>
                                </div>


                            </div>
                        </form>
                    )}

                </Formik>

            </div>
        );
    }
}

export default NewPayment;
