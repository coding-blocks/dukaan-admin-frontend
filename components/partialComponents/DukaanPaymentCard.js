import React from 'react';
import ReactDOM from 'react-dom';
import Price from "../Price";
import {capturePaymentManual} from "../../controllers/dukaanTransactions"
import Swal from "sweetalert2";
import formatter from "../../helpers/formatter";

class DukaanPaymentCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            paymentInvoice: props.paymentInvoice,
            razorpayResponse: props.razorpayResponse,
            razorpayPayment: props.razorpayPayment
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.paymentInvoice !== props.paymentInvoice) {
            return {
                paymentInvoice: props.paymentInvoice,
                razorpayResponse: props.razorpayResponse,
                razorpayPayment: props.razorpayPayment
            }
        }
        return null
    }

    componentDidMount() {
    }


    capturePaymentManual = () => {
        Swal.fire({
            title: "Capture this payment?",
            text: "This action cannot be reverted",
            type: "question",
            confirmButtonColor: "#f66",
            confirmButtonText: "Capture",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then(result => {
            if (result.value) {
                capturePaymentManual({
                    razorpay_order_id: this.state.razorpayResponse.order_id,
                    razorpay_payment_id: this.state.razorpayResponse.id,
                    amount: this.state.razorpayResponse.amount.toString(),
                    txnId: this.state.razorpayPayment.transaction.id
                }).then((response) => {
                    Swal.fire({
                        title: "Payment captured successfully",
                        type: "success",
                        timer: "3000",
                        showConfirmButton: true,
                        confirmButtonText: "Okay"
                    }).then(() => window.location.reload())
                }).catch((err) => {
                    Swal.fire({
                        title: "Error while capturing payment",
                        text: err,
                        type: "error",
                        showConfirmButton: true
                    });
                })
            }
        })
    }

    render() {
        return (
            <div className="container">
                <div className="row justify-content-center p-4">
                    <div className="col-12 col-md-6">
                        <div
                            className="border-card pt-4 mb-4"
                            style={{borderColor: "#27a87c", borderWidth: ".2vh"}}>
                            <div className="row justify-content-between align-items-center">
                                <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                                    <div className="col-md-3 col-4">
                                        <img className="round"
                                             src={this.state.paymentInvoice.product.image_url} alt=""/>
                                    </div>
                                    <div className="description justify-content-center">
                                        <div>
                                            <h4>{this.state.paymentInvoice.product.name}</h4>
                                            <div
                                                className="grey font-sm">{this.state.paymentInvoice.product.description}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {/* Payment status:{" "} */}
                                    {this.state.razorpayResponse.status === "captured" ? (
                                        <div style={{color: '#16c445', fontSize: "1.5rem"}}>
                                            <strong>Captured</strong>
                                            <i className="fa fa-check ml-2" aria-hidden="true"/>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {this.state.razorpayResponse.status === "authorized" ? (
                                        <div style={{color: "#56c0e0", fontSize: "1.5rem"}}>
                                            <strong>Authorized</strong>
                                            <i className="fa fa-check ml-2" aria-hidden="true"/>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {this.state.razorpayResponse.status === "failed" ? (
                                        <div style={{color: "#f34e4b", fontSize: "1.5rem"}}>
                                            <strong>Failed</strong>
                                            <i className="fa fa-times ml-2" aria-hidden="true"/>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                    {this.state.razorpayResponse.status === "refunded" ? (
                                        <div style={{color: "#4f8ef3", fontSize: "1.5rem"}}>
                                            <strong>Refunded</strong>
                                            <i className="fa fa-times ml-2" aria-hidden="true"/>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                </div>


                                <div className="col-md-12">
                                    <div className="col-md-5 px-0 pt-2 mr-3">
                                        <div className={"row align-items-center"}>
                                            <div className={"pr-3"}>Payment Amount</div>
                                            <Price amount={this.state.razorpayResponse.amount / 100}/>
                                        </div>
                                        {this.state.razorpayResponse.status === "captured" ? (
                                            <div className={"row align-items-center"}>
                                                <div className={"pr-3"}>Receipt Code</div>
                                                <p>{this.state.razorpayPayment.transaction.receipt_code}</p>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        {
                                            this.state.razorpayPayment?.transaction?.invoice?.invoice_link ?
                                                <div className={"row align-items-center"}>
                                                    <div className={"pr-3"}>Receipt PDF</div>
                                                    <a href={this.state.razorpayPayment?.transaction?.invoice?.invoice_link} target="blank">
                                                        <button className="button-solid">View Invoice</button>
                                                    </a>
                                                </div>
                                                : <div/>

                                        }

                                    </div>
                                </div>
                            </div>
                            <div className="divider-h mt-4 mb-4"/>
                            <div className="d-flex justify-content-center">
                                {this.state.razorpayResponse.status === "authorized" ?
                                    (
                                        <div className={"mr-4"}>
                                            <button className="button-solid lg" onClick={this.capturePaymentManual}>
                                                Capture Payment
                                            </button>
                                        </div>
                                    ) : <div/>
                                }

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

}

export default DukaanPaymentCard;
