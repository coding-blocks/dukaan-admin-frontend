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
            razorpayPayment: props.razorpayPayment,
            razorpayResponse: props.razorpayResponse
        }
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
                    console.log('Response is', response)
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
            <div>
                <div className="row justify-content-center p-4">
                    <div
                        className="border-card pt-4 mb-4"
                        style={{borderColor: "#27a87c", borderWidth: ".2vh"}}>
                        <div className="row justify-content-between align-items-center">
                            <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                                <div className="col-md-3 col-4 mt-1 mr-5">
                                    <img className="round"
                                         src={this.state.razorpayPayment.transaction.invoice.product.image_url} alt=""/>
                                </div>
                                <div className="description justify-content-center">
                                    <div>
                                        <h4>{this.state.razorpayPayment.transaction.invoice.product.name}</h4>
                                        <div
                                            className="grey font-sm">{this.state.razorpayPayment.transaction.invoice.product.description}</div>
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

                            </div>


                            <div className="col-md-12">
                                <div className="col-md-5 px-0 pt-4 mr-3 mb-4">
                                    <div className={"row"}>
                                        <p className={"mr-5"}>Payment Amount</p>
                                        <Price amount={this.state.razorpayPayment.amount / 100}/>
                                    </div>

                                </div>
                                <div className="font-sm grey">

                                </div>

                                <div className="font-sm grey">

                                </div>
                            </div>
                        </div>
                        <div className="divider-h mt-4 mb-4"/>
                        <div className="d-flex justify-content-center mr-5">
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
        )
    }

}

export default DukaanPaymentCard;
