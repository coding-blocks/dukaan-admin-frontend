import React from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import "../DukaanAPI";
import Swal from "sweetalert2";
import Cookies from 'js-cookie'
import jwt from "jsonwebtoken";
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
        this.couponCannotClubbedRef = React.createRef();

        this.state = {
            products: [],
            centers: [],


            selectedProduct: null,
            amountToPay: 0,
            selectedUser: props.selectedUser,
            selected_center: "",
            coupon: "",
            paymentMode: "cash",
            useCredits: false,
            useCoupon: false,
            totalAppliedCredits: 0,
            userAmountInput: "",

            formValues: {
                comments: "",
                coupon: "",
                paymentMode: "cash",
                quantity: "1",
                stateId: props.primaryAddress.stateId,
                oneauthId: "" + props.userid
            }
        };
        this.ReactSwal = withReactContent(Swal);
    }

    componentDidMount() {
        Promise.all([
            resourcesController.getCentersByParams(1, true)
        ]).then(([states, centers]) => {
            this.setState({
                selectedUser: this.props.selectedUser,
                showOrders: this.props.showOrders,
                centers: centers.data,
            });
        }).then(() => {
            const dukaanToken = Cookies.get("dukaan-token");
            if (dukaanToken) {
                const userInfo = jwt.decode(dukaanToken);
                let formValues = {...this.state.formValues}
                formValues.paymentCenterId =  userInfo.data.center_id,
                this.setState({formValues})
            }
        }).catch(error => {
            ErrorHandler.handle(error);
        })
    }

    calculateAmountToPay = () => {
        return productsController.handleCalculatePrice({
            coupon: this.state.useCoupon ? this.state.coupon.toUpperCase() : "",
            oneauthId: this.props.userid,
            productId: this.state.selectedProduct.id,
            quantity: 1,
            useCredits: this.state.useCredits
        }).then((res) => {
            return res;
        }).catch((error) => {
            ErrorHandler.handle(error)
        });
    }

    applyCoupon2 = () => {
        if (this.state.coupon && this.state.selectedProduct) {
            couponController.checkCouponExclusivity({
                couponName: this.state.coupon, userId: this.state.selectedUser.id
            }).then((response) => {
                if (response.data.clubbingResponse === 'CLUBBING_INVALID' && this.state.useCredits) {
                    this.showCouponClubbingInvalid()
                } else if (response.data.clubbingResponse === 'CLUBBING_INVALID') {
                    this.setState({
                        useCoupon: true
                    })
                    this.calculateAmountToPay().then((response) => {
                        this.setState({
                            amountToPay: formatter.paisaToRs(response.data.amount),
                        })
                        this.setCouponAppliedUI()
                        this.showCreditClubbingInvalid()
                    })
                } else if (response.data.clubbingResponse === 'CLUBBING_OK') {
                    this.setState({
                        useCoupon: true
                    })
                    this.calculateAmountToPay().then((response) => {
                        this.setState({
                            amountToPay: formatter.paisaToRs(response.data.amount),
                        })
                        this.setCouponAppliedUI()
                    })
                }
            }).catch((error) => {
                ErrorHandler.handle(error)
            })
        }
    }


    removeCoupon2 = () => {
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
                this.setState({
                    coupon: "",
                    useCredits: false,
                    useCoupon: false
                })
                this.calculateAmountToPay().then((response) => {
                    this.setState({
                        amountToPay: formatter.paisaToRs(response.data.amount),
                    })
                })
                this.removeCouponAppliedUI()
                this.removeCreditsAppliedUI()
            }
        })


    }

    applyCredits2 = () => {
        if (this.state.selectedProduct) {
            this.setState({
                useCredits: true
            }, () => {
                this.calculateAmountToPay().then((res) => {
                    this.setState({
                        amountToPay: formatter.paisaToRs(res.data.amount),
                        totalAppliedCredits: res.data.creditsApplied
                    })
                })
            });
            this.setCreditsAppliedUI()

        }
    }

    removeCredits2 = () => {
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
                    coupon: ""
                })
                this.calculateAmountToPay().then((res) => {
                    this.setState({
                        amountToPay: formatter.paisaToRs(res.data.amount)
                    }, () => {
                        this.removeCreditsAppliedUI()
                        this.removeCouponAppliedUI()
                    });
                })

            }
        })
    }


    setCouponAppliedUI = () => {
        this.couponInputRef.current.disabled = true
        this.couponAppliedTextRef.current.style.display = 'block'
        this.couponNotAppliedTextRef.current.style.display = 'none'
        this.couponCannotClubbedRef.current.style.display = 'none'
        this.couponRemoveButtonRef.current.style.display = 'block'
        this.couponApplyButtonRef.current.style.display = 'none'
    }

    setCouponInvalidUI = () => {
        this.couponNotAppliedTextRef.current.style.display = 'block'
        this.couponAppliedTextRef.current.style.display = 'none'
    }

    removeCouponAppliedUI = () => {
        this.couponInputRef.current.disabled = false
        this.couponInputRef.current.value = ''
        this.couponRemoveButtonRef.current.style.display = 'none'
        this.couponApplyButtonRef.current.style.display = 'block'
        this.couponAppliedTextRef.current.style.display = 'none'
    }

    setCreditsAppliedUI = () => {
        this.creditsRemoveRef.current.style = {}
        this.creditsApplyRef.current.style.display = 'none'
    }

    removeCreditsAppliedUI = () => {
        if (this.creditsClubbingRef.current) {
            this.creditsApplyRef.current.style = {}
            this.creditsRemoveRef.current.style.display = 'none'
            this.couponCannotClubbedRef.current.style.display = 'none'
            this.creditsClubbingRef.current.style.display = 'none'
        }

    }

    showCouponClubbingInvalid = () => {
        this.couponCannotClubbedRef.current.style = {}
    }

    showCreditClubbingInvalid = () => {
        if (this.creditsClubbingRef.current) {
            this.creditsClubbingRef.current.style = {}
            this.creditsApplyRef.current.style.display = 'none'
            this.creditsRemoveRef.current.style.display = 'none'
        }
    }


    handleProductCenterChange = e => {
        this.setState({
            selected_center: e.target.value,
        });
        productsController.handleGetProducts({
                center_id : e.target.value,
                organization_id: 1,
                listed: true
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
                    this.calculateAmountToPay().then((res) => {
                        this.setState({
                            amountToPay: formatter.paisaToRs(res.data.amount)
                        })
                    })
                });
            } else {
                this.setState({
                    products: [],
                    selectedProduct: {},
                    amountToPay: 0
                }, () => {
                });
            }
        })
    };

    handleProductChange = e => {
        this.setState({
            selectedProduct: JSON.parse(e.target.selectedOptions[0].dataset.product),
            useCredits: false,
            amountToPay: 0,
            coupon: ""
        }, () => {
            this.calculateAmountToPay().then((res) => {
                this.setState({
                    amountToPay: formatter.paisaToRs(res.data.amount),
                })
            })
            this.removeCouponAppliedUI();
            this.removeCreditsAppliedUI();
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


    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
            formValues: newFormValues
        });
    };

    onChangeAmountInput = e => {
        this.setState({
            userAmountInput: e.target.value
        })
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
        if (this.state.userAmountInput < formatter.paisaToRs(this.state.selectedProduct.emi_min_base)) {
            Swal.fire({
                title: "Cannot create payment!",
                text: `Payment amount cannot be less than ₹ ${formatter.paisaToRs(this.state.selectedProduct.emi_min_base)}`,
                type: "info"
            });
            return false;
        }

        if (this.state.userAmountInput > this.state.amountToPay) {
            Swal.fire({
                title: "Cannot create payment!",
                text: `Payment amount cannot be greater than ₹ ${(this.state.amountToPay)}`,
                type: "info"
            });
            return false;
        }

        if (!this.state.formValues.paymentCenterId) {
            Swal.fire({
                title: "Cannot create payment!",
                text: `Please select payment center`,
                type: "info"
            });
            return false;
        }
        return true;
    };


    makePaymentNetworkRequest = (purchasePayload) => {
        purchasesController.handleCreateNewPurchase(purchasePayload).then(() => {
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

    showPartialCheckConfirmation = () => {
        Swal.fire({
            input: 'checkbox',
            titleText: "Create a partial payment?",
            text: `Payment amount ₹ ${this.state.userAmountInput} is less than ₹ ${this.state.amountToPay}`,
            inputPlaceholder:
                'Make this payment partial',
            confirmButtonColor: "#f66",
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Mark this as partial payment to continue.'
                }
            }
        }).then((result) => {
            if (result.value) {
                const purchasePayload = {
                    coupon: this.state.coupon,
                    useCredits: this.state.useCredits,
                    partialAmount: this.state.userAmountInput,
                    partialPayment: true,
                    productId: this.state.selectedProduct.id,
                    ...this.state.formValues
                }
                this.makePaymentNetworkRequest(purchasePayload)
            }
        })
    }


    showCompleteCheckConfirmation = () => {
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
                const purchasePayload = {
                    coupon: this.state.coupon,
                    useCredits: this.state.useCredits,
                    productId: this.state.selectedProduct.id,
                    ...this.state.formValues
                }
                this.makePaymentNetworkRequest(purchasePayload)
            }
        });
    }

    handleSubmit = async e => {
        e.preventDefault();
        if (this.customValidations()) {
            if (this.state.userAmountInput < this.state.amountToPay) {
                this.showPartialCheckConfirmation()
            } else {
                this.showCompleteCheckConfirmation()
            }
        }
    };

    PaymentMethod = () => {
        if (this.state.formValues.paymentMode === "cheque") {
            return <ChequeFields bankName={this.state.formValues.bank}
                                 chequeLocation={this.state.formValues.chequeLocation}
                                 serialNumber={this.state.formValues.serialNumber}
                                 branchName={this.state.formValues.branchName}
                                 issueDate={this.state.formValues.issueDate}
                                 onChange={this.onChangeValue}

            />
        } else if (this.state.formValues.paymentMode === "neft") {
            return <NeftFields neftLocation={this.state.formValues.neftLocation}
                               neftUTR={this.state.formValues.neftUtr}
                               neftDate={this.state.formValues.neftDate}
                               neftBank={this.state.formValues.neftBank}
                               onChange={this.onChangeValue}
            />
        } else if (this.state.formValues.paymentMode === "swipe") {
            return <SwipeFields swipeLocation={this.state.formValues.swipeLocation}
                                swipeAppCode={this.state.formValues.swipeAppCode}
                                swipeUTR={this.state.formValues.swipeUtr}
                                issueDate={this.state.formValues.issueDate}
                                onChange={this.onChangeValue}

            />
        } else {
            return <div/>;
        }
    };


    render() {
        return (
            <div className={"d-flex align-items-center col-md-8"}>
                <form id="new_payment_form" autoComplete="off" onSubmit={this.handleSubmit}>
                    <div className={"border-card coupon-card "}>
                        {/* Title */}
                        <div className={"d-flex justify-content-center mt-1 pb-3"}>
                            <h2 className={"title red"}>Make New Payment</h2>
                        </div>

                        {/* Course category*/}
                        <FieldWithElement
                            name={"Center"}
                            nameCols={3}
                            elementCols={9}
                            elementClassName={"pl-4"}>
                            <select
                                name="product_center"
                                defaultValue={"select"}
                                onChange={this.handleProductCenterChange}
                                required>
                                <option value="select" disabled={true}>
                                    Choose a center
                                </option>
                                {this.state.centers.map(category => (
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
                                value={this.state.formValues.paymentCenterId}
                                defaultValue={"select"}
                                onChange={this.onChangeValue}>
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
                                            onClick={this.applyCoupon2}
                                            className={" col button-solid ml-2"}>
                                            Apply Coupon
                                        </button>
                                    </div>

                                    <div style={{display: 'none'}} ref={this.couponRemoveButtonRef}>
                                        <button
                                            id="removeCoupon"
                                            type="button"
                                            onClick={this.removeCoupon2}
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

                                <div ref={this.couponCannotClubbedRef} style={{display: 'none'}}>
                                    <p style={{color: 'red'}}>{`Coupon cannot be applied as credits is being used.`}</p>
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
                                            onClick={this.applyCredits2}
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
                                            onClick={this.removeCredits2}
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
                            className="red"
                            nameCols={3}
                            elementCols={9}
                            name={"Payment Amount (₹)"}>
                            <input
                                type="number"
                                className={"input-text"}
                                required
                                onChange={this.onChangeAmountInput}
                                name={"userAmountInput"}
                                value={this.state.userAmountInput}
                                pattern={"[0-9]{1,10}"}
                            />
                            <span className="red">
                  Payment amount cannot be less than ₹
                                {this.state.selectedProduct
                                    ? formatter.paisaToRs(this.state.selectedProduct.emi_min_base)
                                    : 0
                                } as per course minimum payable amount.
                </span>
                        </FieldWithElement>


                        {/* Payment comments */}
                        <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
                            <input
                                type="text"
                                className={"input-text"}
                                placeholder="Place a comment"
                                name={"comments"}
                                onChange={this.onChangeValue}
                                value={this.state.formValues.comments}
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

            </div>
        );
    }

}

export default NewPayment;
