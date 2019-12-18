import React from 'react';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import ErrorHandler from "../../../helpers/ErrorHandler";
import DukaanPaymentCard from "../../../components/partialComponents/DukaanPaymentCard";
import Swal from "sweetalert2";

const {getTransactionByRazorpayPaymentId} = require("../../../controllers/dukaanTransactions");

class DukaanPayments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            razorpayPayment: null,
            paymentInvoice: null,
            razorpayResponse: null,
            razorpayPaymentId: ""

        }
    }

    componentDidMount() {

    }

    onChangeValue = e => {
        this.setState({
            razorpayPaymentId: e.target.value
        });
    };

    showPaymentCannotBeCapturedError = () => {
        Swal.fire({
            title: "This payment cannot be captured here!",
            text: "To capture this payment, contact dukaan dev team.",
            type: "error",
            showConfirmButton: true
        });
    }

    fetchDukaanPayments = () => {
        if (this.state.razorpayPaymentId) {
            getTransactionByRazorpayPaymentId(this.state.razorpayPaymentId).then((response) => {
                if (!response.data.razorpayPayment) {
                    Swal.fire({
                        title: "This payment cannot be found on dukaan server!",
                        text: "To capture this payment, contact dukaan dev team.",
                        type: "error",
                        showConfirmButton: true
                    });
                    return;
                }


                // If the payment is a partial payment and no partial_payment object hash exists
                if (response.data.razorpayPayment.transaction.partial_payment_id && !response.data.razorpayPayment.transaction.partial_payment) {
                    this.showPaymentCannotBeCapturedError()
                    return;
                    // If the payment is not a partial payment and no invoice object on transaction hash exists
                } else if (!response.data.razorpayPayment.transaction.partial_payment_id && !response.data.razorpayPayment.transaction.invoice) {
                    this.showPaymentCannotBeCapturedError()
                    return;

                }

                // If invoice amount does not match with the razorpay amount for non partial payment
                if (!response.data.razorpayPayment.transaction.partial_payment_id &&
                    response.data.razorpayPayment.transaction.invoice.amount
                    !== response.data.razorpayResponse.amount) {
                    this.showPaymentCannotBeCapturedError()
                    return;

                }

                // If invoice amount for partial_payment  does not match with the razorpay amount
                if (response.data.razorpayPayment.transaction.partial_payment_id &&
                    response.data.razorpayPayment.transaction.partial_payment.partial_amount !== response.data.razorpayResponse.amount) {
                    this.showPaymentCannotBeCapturedError()
                    return;

                }

                if (response.data.razorpayPayment.transaction.partial_payment) {
                    this.setState({
                        razorpayPayment: response.data.razorpayPayment,
                        paymentInvoice: response.data.razorpayPayment.transaction.partial_payment.invoice,
                        razorpayResponse: response.data.razorpayResponse,
                        isPartialPayment: true
                    })
                } else {
                    this.setState({
                        razorpayPayment: response.data.razorpayPayment,
                        paymentInvoice: response.data.razorpayPayment.transaction.invoice,
                        razorpayResponse: response.data.razorpayResponse,
                        isPartialPayment: false
                    })
                }

            }).catch((err) => {
                console.log('Error', err)
                ErrorHandler.handle(err)
            })
        }

    }

    resetCurrentSearch = () => {
        window.location.href = "/admin/payments"
    }

    render() {

        return (<div>
            <div>
                <Head>
                    <title>{"System Transactions | Dukaan"}</title>
                </Head>
                <Layout>
                    <div className={"d-flex col-12 mt-4 ml-3 justify-content-center"}>

                        <div className="input-search w-75" style={{display: "inline-block"}}>
                            <input autoComplete={"off"} id="razorpayPaymentId" value={this.state.razorpayPaymentId}
                                   type="text"
                                   placeholder="Enter razorpay payment ID" onChange={this.onChangeValue}/>
                        </div>

                        <button
                            id="search"
                            onClick={this.fetchDukaanPayments}
                            className="button-solid mb-1"
                            style={{fontSize: "1.3rem"}}>
                            Search
                        </button>
                    </div>

                    <div className={"container"}>
                        <div>
                            {this.state.paymentInvoice ? <DukaanPaymentCard
                                paymentInvoice={this.state.paymentInvoice}
                                razorpayResponse={this.state.razorpayResponse}
                                razorpayPayment={this.state.razorpayPayment}
                            /> : <div/>}
                        </div>

                        <div>
                            {
                                this.state.razorpayPayment ?
                                    <button onClick={this.resetCurrentSearch} className="button-solid lg">Search
                                        New</button> : <div>

                                    </div>
                            }
                        </div>
                    </div>

                </Layout>
            </div>


        </div>)
    }

}

export default DukaanPayments
