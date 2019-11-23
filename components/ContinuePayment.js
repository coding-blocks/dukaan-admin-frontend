import React, {useEffect, useState} from "react";
import FieldWithElement from "./FieldWithElement";
import "../styles/pages/admin/coupons.scss";
import Swal from "sweetalert2";
import formatter from "../helpers/formatter"
import resourcesController from "../controllers/resources";
import purchasesController from "../controllers/purchases";
import Router from "next/router";
import ErrorHandler from '../helpers/ErrorHandler';
import ChequeFields from "./partialComponents/ChequePaymentFields";
import NeftFields from "./partialComponents/NeftPaymentFields";
import SwipeFields from "./partialComponents/SwipePaymentFields";


function ContinuePayment(props) {
    const [formValues, setFormValues] = useState({
        comments: "",
        paymentMode: "cash",
        quantity: "1",
        oneauthId: props.oneauthId,
        cartId: props.cart_id,
        partialPayment: true
    });

    const [centers, setCenters] = useState([]);

    const [id, setId] = useState([]);

    useEffect(() => {
        setId(props.id);
    });

    useEffect(() => {
        resourcesController.getCenters().then(res => {
            setCenters(res.data);
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error while getting centers!",
                text: error
            });
        });
    }, []);

    useEffect(() => {
        setFormValues({
            comments: "",
            paymentMode: "cash",
            quantity: "1",
            oneauthId: props.oneauthId,
            cartId: props.cart_id,
            partialPayment: true
        });
    }, [props.cart_id, props.oneauthId]);

    /**
     * Custom Validations for the continue payment form
     * @return {boolean} isValid – Returns a bool that tells
     *  if the form passed validation
     */
    const customValidations = () => {
        if (!document.getElementById("continue_payment_form").checkValidity()) {
            document.getElementById("continue_payment_form").reportValidity();
            return false;
        } else {
            return true;
        }
    };

    const onChangeValue = e => {
        // let newFormValues = { [e.target.name]: e.target.value };
        const name = e.target.name;
        const val = e.target.value;
        setFormValues(formValues => {
            return {
                ...formValues,
                [name]: val
            };
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (customValidations()) {
            const result = await Swal.fire({
                title: "Are you sure you want to make a new payment?",
                type: "question",
                confirmButtonColor: "#f66",
                confirmButtonText: "Yes!",
                cancelButtonText: "No!",
                showCancelButton: true,
                showConfirmButton: true,
                showCloseButton: true
            });

            if (!result.value) return;

            const data = formValues;
            purchasesController
                .handleCreateNewPurchase(data)
                .then(res => {
                    Swal.fire({
                        title: "Payment successful!",
                        type: "success",
                        timer: 3000,
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    });

                    Router.push(`/admin/orders?id=${id}`);
                })
                .catch(error => {
                    Swal.fire({
                        title: "Error while making payment!",
                        type: "error",
                        text: error,
                        showConfirmButton: true
                    });
                });
        }
    };

    const PaymentMethod = () => {
        if (formValues.paymentMode === "cheque") {
            return <ChequeFields bankName={formValues.bank}
                                 chequeLocation={formValues.chequeLocation}
                                 serialNumber={formValues.serialNumber}
                                 branchName={formValues.branchName}
                                 issueDate={formValues.issueDate}
                                 onChange={onChangeValue}

            />
        } else if (formValues.paymentMode === "neft") {
            return <NeftFields neftLocation={formValues.neftLocation}
                               neftUTR={formValues.neftUtr}
                               neftDate={formValues.neftDate}
                               neftBank={formValues.neftBank}
                               onChange={onChangeValue}
            />
        } else if (formValues.paymentMode === "swipe") {
            return <SwipeFields swipeLocation={formValues.swipeLocation}
                                swipeAppCode={formValues.swipeAppCode}
                                swipeUTR={formValues.swipeUtr}
                                issueDate={formValues.issueDate}
                                onChange={onChangeValue}

            />
        } else {
            return <div/>;
        }
    };


    return (
        <div className={"d-flex align-items-center col-md-8"}>
            <div className={"border-card coupon-card "}>
                {/* Title */}
                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                    <h2 className={"title red"}>Continue Payment</h2>
                </div>
                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                    <h3>
                        Amount Left <span className="red">₹ {props.amountLeft}</span>
                    </h3>
                </div>

                <div className="divider-h mb-2 mt-2"/>

                <form id="continue_payment_form">
                    <FieldWithElement
                        name={"Payment Center"}
                        nameCols={3}
                        elementCols={9}
                        elementClassName={"pl-4"}
                    >
                        <select name="paymentCenterId" defaultValue={"select"} onChange={onChangeValue} required>
                            <option value="select" disabled={true}>
                                Select Payment Center
                            </option>
                            {centers.map(center => {
                                return (
                                    <option value={center.id} key={center.id}>
                                        {center.name}
                                    </option>
                                );
                            })}
                        </select>
                    </FieldWithElement>

                    <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
                        <input
                            type="text"
                            className={"input-text"}
                            placeholder="Write Your Comment Here"
                            name={"comments"}
                            onChange={onChangeValue}
                            value={formValues.mobile_number}
                        />
                    </FieldWithElement>

                    <FieldWithElement
                        name={"Choose Payment Method"}
                        nameCols={3}
                        elementCols={9}
                        elementClassName={"pl-4"}
                    >
                        <select name="paymentMode" onChange={onChangeValue}>
                            <option value="cash">
                                CASH
                            </option>
                            <option value="neft">NEFT</option>
                            <option value="cheque">CHEQUE</option>
                            <option value="swipe">SWIPE</option>
                        </select>
                    </FieldWithElement>
                    <div className="divider-h mb-5 mt-5"/>
                    {PaymentMethod()}

                    <FieldWithElement
                        className="red"
                        nameCols={3}
                        elementCols={9}
                        name={"Partial Amount (Rs.)"}
                    >
                        <input
                            type="text"
                            className={"input-text"}
                            name={"partialAmount"}
                            onChange={onChangeValue}
                            value={formValues.partialAmount}
                            pattern={"[0-9]{1,10}"}
                            title={"Partial amount can only be numbers"}
                            required
                        />
                        <span className="red">
              Partial amount cannot be less than Rs. {formatter.paisaToRs(props.minBase)}
            </span>
                    </FieldWithElement>

                    <div className={"d-flex justify-content-center"}>
                        <button
                            id="search"
                            className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                            onClick={handleSubmit}
                        >
                            Record Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ContinuePayment;
