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
import couponController from "../controllers/coupons";
import productCategoriesController from "../controllers/productcategories";
import ChequeFields from "./partialComponents/ChequePaymentFields";
import SwipeFields from "./partialComponents/SwipePaymentFields";
import {Formik} from "formik";
import ErrorHandler from "../helpers/ErrorHandler";
import NeftFields from "./partialComponents/NeftPaymentFields";

class NewPayment extends React.Component {
    constructor(props) {
        super(props);
        this.couponAppliedTextRef = React.createRef();
        this.couponNotAppliedTextRef = React.createRef();

        this.couponInputRef = React.createRef();

        this.couponApplyButtonRef = React.createRef();
        this.couponRemoveButtonRef = React.createRef();

        this.creditsApplyRef = React.createRef();
        this.creditsRemoveRef = React.createRef();
        this.creditsClubbingRef = React.createRef();

        this.state = {
            selectedProduct: null,
            amountToPay: 0,
            selectedUser: props.selectedUser,
            states: [],
            product_categories: [],
            products: [],
            product_category: "",
            amount: "",
            min_emi: "",
            centers: [],
            id: props.id,
            coupon: "",
            paymentMode: "cash",
            partialPayment: false,
            useCredits: false,
            totalAppliedCredits: 0,
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

    calculateAmount = (applyCredits) => {
        if (this.state.selectedProduct)
            if (this.state.selectedProduct.id) {
                productsController.handleCalculatePrice({
                    coupon: this.state.coupon.toUpperCase(),
                    oneauthId: this.props.userid,
                    productId: this.state.selectedProduct.id,
                    quantity: 1,
                    useCredits: this.state.useCredits
                }).then((res) => {
                    if (res.data.amount >= 0 && res.data.couponApplied) {
                        this.setState({
                            amountToPay: formatter.paisaToRs(res.data.amount),
                            totalAppliedCredits: res.data.creditsApplied
                        });
                        this.couponInputRef.current.disabled = true
                        this.couponAppliedTextRef.current.style.display = 'block'
                        this.couponNotAppliedTextRef.current.style.display = 'none'

                        this.couponRemoveButtonRef.current.style.display = 'block'
                        this.couponApplyButtonRef.current.style.display = 'none'
                    } else if (res.data.amount >= 0 && !res.data.couponApplied && this.state.coupon) {
                        this.setState({
                            amountToPay: formatter.paisaToRs(res.data.amount),
                            totalAppliedCredits: res.data.creditsApplied
                        });
                        this.couponNotAppliedTextRef.current.style.display = 'block'
                        this.couponAppliedTextRef.current.style.display = 'none'
                    } else if (res.data.amount >= 0 && !res.data.couponApplied && !this.state.coupon) {
                        this.setState({
                            amountToPay: formatter.paisaToRs(res.data.amount),
                            totalAppliedCredits: res.data.creditsApplied
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
                this.setState({
                    amountToPay: 0,
                    totalAppliedCredits: 0,
                    useCredits: false
                });

                console.log('Reset coupon UI must be called now')
                this.resetCouponUI();
            }

    };

    handleProductCategoryChange = e => {
        this.setState({
            product_category: e.target.value,
        });
        productsController.handleGetProducts({
                product_category_id: e.target.value
            }, {
                page: 1,
                limit: 100
            }
        ).then((response) => {
            if (response.results.length > 0) {
                this.setState({
                    products: response.results,
                    selectedProduct: response.results ? response.results[0] : {},
                }, () => {
                    this.calculateAmount();
                });
            } else {
                console.log('Else case chalna chahiye')
                this.setState({
                    products: [],
                    selectedProduct: {},
                    amountToPay: 0
                }, () => {
                    this.calculateAmount();
                });
            }
        })
    };

    handleProductChange = e => {
        this.setState({
            selectedProduct: JSON.parse(e.target.selectedOptions[0].dataset.product),
        }, () => {
            this.calculateAmount();
        })
    }

    handleCouponChange = (e) => {
        this.setState({
            coupon: e.target.value
        })
        if (e.target.value.length === 0) {
            this.couponNotAppliedTextRef.current.style.display = 'none'
        }

    }

    onChangePaymentMode = e => {
        this.setState({
            paymentMode: e.target.value
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

    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
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
        if (this.state.paymentMode === "cheque") {
            return <ChequeFields/>
        } else if (this.state.paymentMode === "neft") {
            return <NeftFields/>
        } else if (this.state.paymentMode === "swipe") {
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


    removeCoupon = () => {
        Swal.fire({
            title: "Remove applied coupon?",
            type: "question",
            confirmButtonColor: "#f66",
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then(result => {
            if (result.value) {
                this.resetCouponUI()
                this.resetCreditsUI()
            }
        })
    }


    resetCouponUI = () => {
        if (this.state.coupon.length > 0) {
            this.setState({
                coupon: ""
            }, () => {
                this.couponInputRef.current.disabled = false
                this.couponInputRef.current.value = ''
                this.couponRemoveButtonRef.current.style.display = 'none'
                this.couponApplyButtonRef.current.style.display = 'block'
                this.couponAppliedTextRef.current.style.display = 'none'
                this.calculateAmount();
            })

        }

    }

    resetCreditsUI = () => {
        this.creditsApplyRef.current.style = {}
        this.creditsClubbingRef.current.style.display = 'none'
        this.creditsRemoveRef.current.style.display = 'none'
        this.calculateAmount();
    }


    applyCredits = () => {
        this.setState({
            useCredits: true
        }, () => {
            this.calculateAmount()
        });

        if (this.state.totalAppliedCredits > 0) {
            this.creditsRemoveRef.current.style = {}
            this.creditsApplyRef.current.style.display = 'none'
        }
    }

    removeCredits = () => {
        Swal.fire({
            title: "Remove applied credits?",
            type: "question",
            confirmButtonColor: "#f66",
            confirmButtonText: "Remove",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then(result => {
            if (result.value) {
                this.setState({
                    useCredits: false,
                    totalAppliedCredits: 0,
                }, () => {
                    this.calculateAmount()
                    this.creditsApplyRef.current.style = {}
                    this.creditsRemoveRef.current.style.display = 'none'
                });
            }
        })

    }

    checkCouponExclusivity = () => {
        if (this.state.coupon) {
            couponController.checkCouponExclusivity({
                couponName: this.state.coupon, userId: this.state.selectedUser.id
            }).then((response) => {
                if (response.data.clubbingResponse === 'CLUBBING_INVALID') {
                    this.calculateAmount();
                    this.creditsClubbingRef.current.style = {}
                    this.creditsApplyRef.current.style.display = 'none'
                    this.creditsRemoveRef.current.style.display = 'none'
                    console.log('Credits cannot be applied')
                } else if(response.data.clubbingResponse === 'CLUBBING_OK'){
                    this.calculateAmount();
                }
            }).catch((error) => {
                console.log('Error occured')
                this.calculateAmount();
                ErrorHandler.handle(error)
            })
        }
    }

    render() {
        return (
            <div className={"d-flex align-items-center col-md-8"}>
                <Formik initialValues={this.getFormikInitialValues()}
                        validate={(values) => {
                            return this.formikValidate(values)
                        }}
                        onSubmit={(values, {setSubmitting}) => {
                            return this.formikOnSubmit(values)
                        }}>

                    {({
                          values,
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
                                    elementCols={7} name={"Coupon Code"}
                                    errors={errors.coupon}
                                    errorColor={'tomato'}>

                                    <div className={"row align-items-center"}>
                                        <input
                                            type="text"
                                            ref={this.couponInputRef}
                                            className={"input-text col mr-6"}
                                            placeholder="Add a coupon code"
                                            name={"coupon"}
                                            onChange={this.handleCouponChange}
                                            value={this.state.coupon}
                                        />

                                        <div>
                                            <div ref={this.couponApplyButtonRef}>
                                                <button
                                                    id="applyCoupon"
                                                    type="button"
                                                    onClick={this.checkCouponExclusivity}
                                                    className={" col button-solid ml-2"}>
                                                    Apply Coupon
                                                </button>
                                            </div>

                                            <div style={{display: 'none'}} ref={this.couponRemoveButtonRef}>
                                                <button
                                                    id="removeCoupon"
                                                    type="button"
                                                    onClick={this.removeCoupon}
                                                    className={" col button-solid ml-2"}>
                                                    Remove Coupon
                                                </button>
                                            </div>

                                        </div>

                                    </div>

                                    <div id={"couponStatus"}>
                                        <div ref={this.couponAppliedTextRef} style={{display: 'none'}}>
                                            <p style={{color: 'green'}}>{`Coupon ${this.state.coupon} applied successfully`}</p>
                                        </div>

                                        <div ref={this.couponNotAppliedTextRef} style={{display: 'none'}}>
                                            <p style={{color: 'red'}}>{`Coupon ${this.state.coupon} not applied`}</p>
                                        </div>
                                    </div>


                                </FieldWithElement>


                                {/* Wallet Credits */}
                                {this.state.selectedUser.wallet_amount > 0 ? <FieldWithElement
                                    nameCols={3}
                                    elementCols={7}
                                    name={"Dukaan Credits"}>

                                    <div>

                                        <div className={"row align-items-center"} ref={this.creditsApplyRef}>
                                            <div>
                                                <p className={"red"}>{`Available ₹ ${this.state.selectedUser.wallet_amount / 100}`}</p>
                                            </div>

                                            <div>
                                                <button
                                                    id="applyCredits"
                                                    type="button"
                                                    onClick={this.applyCredits}
                                                    className={"red font-xs ml-4"}>
                                                    Apply Credits
                                                </button>
                                            </div>
                                        </div>


                                        <div className={"row align-items-center"} style={{display: 'none'}}
                                             ref={this.creditsRemoveRef}>
                                            <div>
                                                <p className={"green"}>{`₹ ${this.state.totalAppliedCredits / 100} Credits Applied`}</p>
                                            </div>

                                            <div>
                                                <button
                                                    id="removeCredits"
                                                    type="button"
                                                    onClick={this.removeCredits}
                                                    className={"red font-xs ml-4"}>
                                                    Remove Credits
                                                </button>
                                            </div>
                                        </div>


                                        <div className={"row align-items-center"} style={{display: 'none'}}
                                             ref={this.creditsClubbingRef}>
                                            <div>
                                                <p className={"red"}>{`Credits cannot be applied as coupon is exclusive`}</p>
                                            </div>

                                        </div>

                                    </div>

                                </FieldWithElement> : <div></div>}


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
                                    <select name="paymentMode" onChange={this.onChangePaymentMode}>
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
                                                defaultValue={false}
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
                                            value={this.state.partialAmount}
                                            pattern={"[0-9]{1,10}"}
                                            required={this.state.partialPayment}
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
                                        onChange={handleChange}
                                        value={values.comment}
                                    />
                                </FieldWithElement>

                                <div className={"d-flex justify-content-center"}>
                                    <button
                                        id="search"
                                        type="submit"
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
