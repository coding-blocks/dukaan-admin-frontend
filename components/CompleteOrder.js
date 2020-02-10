import React from "react";
import FieldWithElement from "./FieldWithElement";
import Swal from "sweetalert2";
import Router from "next/router";
import Modal from "react-modal";
import Price from "./Price";
import resourcesController from "../controllers/resources";
import purchasesController from "../controllers/purchases";
import refundController from "../controllers/refund";
import ErrorHandler from "../helpers/ErrorHandler";
import ChequeFields from "./partialComponents/ChequePaymentFields";

const customStyles = {
    content: {
        top: "38%",
        left: "50%",
        marginRight: "-50%",
        height: "auto",
        width: "auto",
        transform: "translate(-50%, -50%)"
    }
};

class CompleteOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            centers: [],
            showModal: false,
            paymentMethod: this.props.payment_type,
            formValues: {
                payment_type: "credits",
                user_id: this.props.userid,
                txn_id: this.props.txn_id,
                cart_id: this.props.cart_id
            }
        };
    }

    componentDidMount() {
        resourcesController.getCentersByParams(1, true).then(res => {
            this.setState({
                centers: res.data
            });
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Unable to fetch centers!",
                text: error
            });
        });
    }

    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
            formValues: newFormValues
        });
    };
    handleCancelReceipt = async e => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure you want to cancel the receipt?",
            input: 'text',
            confirmButtonColor: "#f66",
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write the reason for cancelling the receipt.'
                }
            }
        })
            .then((result) => {
                if (result.value) {
                    purchasesController.cancelReceipt(this.state.formValues.user_id,
                        this.state.formValues.cart_id, this.state.formValues.txn_id,
                        result.value)
                        .then((res) => {
                            Swal.fire({
                                title: "Receipt successfully cancelled",
                                type: "success",
                                timer: "3000",
                                showConfirmButton: true,
                                confirmButtonText: "Okay"
                            })
                                .then(() => window.location.reload())
                        }).catch(err => {
                        Swal.fire({
                            title: "Error while cancelling receipt",
                            text: err,
                            type: "error",
                            showConfirmButton: true
                        });
                    });
                }
            })
    }

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({
            showModal: false
        });
        Swal.fire({
            title: "Are you sure you want to make a refund?",
            type: "question",
            confirmButtonColor: "#f66",
            confirmButtonText: "Yes!",
            cancelButtonText: "No!",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        }).then(result => {
            if (result.value) {
                const data = this.state.formValues;
                refundController
                    .handleCreateRefund(data)
                    .then(res => {
                        Swal.fire({
                            title: "Refund has been completed!",
                            type: "success",
                            timer: 3000,
                            showConfirmButton: true,
                            confirmButtonText: "Okay"
                        });
                    })
                    .catch(error => {
                        Swal.fire({
                            title: "Error while making a refund!",
                            type: "error",
                            text: error
                        });
                    });
            }
        });
    };

    openModalHandler = () => {
        this.setState({
            showModal: true
        });
    };

    closeModalHandler = () => {
        this.setState({
            showModal: false
        });
    };

    razorpayOption = () => {
        if (this.state.paymentMethod === "razorpay") {
            return <option value="razorpay">Razorpay</option>;
        }
    };
    ModalForm = () => (
        <div>
            <Modal
                isOpen={this.state.showModal}
                onRequestClose={this.closeModalHandler}
                handleSubmit={this.handleSubmit}
                amount={this.props.amount}
                name={this.props.description}
                style={customStyles}
            >
                <div className=" col-md-12">
                    <div>
                        <div className="modal-header">
                            <h3>Make a Refund </h3>
                            <p>Course: <span className="red"> {this.props.description}</span></p>
                            <p>Amount Paid:<span className="red"> ₹ {this.props.amount}</span></p>
                        </div>
                        <div className="modal-body">
                            <FieldWithElement
                                name={"Payment Method"}
                                nameCols={3}
                                elementCols={9}
                                elementClassName={"pl-4"}
                            >
                                <select name="payment_type" onChange={this.onChangeValue}>
                                    <option value="undisclosed" selected>
                                        Select Payment Mode
                                    </option>
                                    <option value="credits">CREDITS</option>
                                    <option value="cheque">CHEQUE</option>
                                    {this.razorpayOption()}

                                </select>
                            </FieldWithElement>

                            {this.paymentMethod()}

                            <FieldWithElement
                                name={"Payment Center"}
                                nameCols={3}
                                elementCols={9}
                                elementClassName={"pl-4"}
                            >
                                <select name="center_id" onChange={this.onChangeValue}>
                                    <option value="undisclosed" selected>
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
                            <FieldWithElement nameCols={3} elementCols={9} name={"Comment"}>
                                <input
                                    type="text"
                                    className={"input-text"}
                                    placeholder="Enter Your Comment"
                                    name={"comment"}
                                    onChange={this.onChangeValue}
                                />
                            </FieldWithElement>

                            <FieldWithElement nameCols={3} elementCols={9} name={"Amount"}>
                                <input
                                    type="text"
                                    className={"input-text"}
                                    placeholder="Enter amount"
                                    name={"amount"}
                                    onChange={this.onChangeValue}
                                />
                            </FieldWithElement>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="button-solid lg mr-4"
                                onClick={this.closeModalHandler}
                            >
                                CLOSE
                            </button>
                            <button className="button-solid lg" onClick={this.handleSubmit}>
                                REFUND
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );

    paymentMethod = () => {
        if (this.state.formValues.payment_type === "cheque") {
            return (
                <ChequeFields bankName={this.state.formValues.bank}
                              serialNumber={this.state.formValues.serialNumber}
                              branchName={this.state.formValues.branch}
                              issueDate={this.state.formValues.issueDate}
                              minDate={60}
                              onChange={this.onChangeValue}/>

            );
        } else if (this.state.formValues.payment_type === "credits") {
            return "";
        }
    };

    render() {
        return (
            <div>
                {this.state.showModal ? this.ModalForm() : ""}
                <div className="row justify-content-center p-4">
                    <div
                        className="border-card pt-4 mb-4"
                        style={{borderColor: "#27a87c", borderWidth: ".2vh"}}
                    >
                        <div className="row justify-content-between align-items-center">
                            <div className="img-desc col-md-8 col-12 mb-4 mb-md-0">
                                <div className="col-md-3 col-4 mt-1 mr-5">
                                    <img className="round" src={this.props.image} alt=""/>
                                </div>
                                <div className="description justify-content-center">
                                    <div>
                                        <h4>{this.props.product_name}</h4>
                                        <div className="grey font-sm">{this.props.description}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {/* Payment status:{" "} */}
                                {this.props.status === "captured" ? (
                                    <div style={{color: "#27a87c", fontSize: "1.5rem"}}>
                                        <strong>Paid</strong>
                                        <i className="fa fa-check ml-2" aria-hidden="true"/>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="col-md-12">
                                <div className="col-md-5 px-0 pt-4 mr-3 mb-4">
                                    <Price amount={this.props.amount}/>
                                </div>
                                <div className="font-sm grey">
                                    Mode Of Payment: {this.props.payment_type}
                                </div>
                                {this.props.partial_payment || this.props.transaction.razorpay_id ? ("") :
                                    (
                                        <div>
                                            <div className="font-sm grey">
                                                Payment Collected
                                                By: {
                                                this.props.transaction[this.props.payment_type] ? this.props.transaction[this.props.payment_type]['admin']['username'] : ''
                                            }
                                            </div>
                                            <div className="font-sm grey">
                                                Payment
                                                Center: {
                                                this.props.transaction[this.props.payment_type] ?  this.props.transaction[this.props.payment_type]['center']['name'] : ''
                                            }
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="font-sm grey">
                                    Purchased on: {this.props.date}
                                </div>
                                {this.props.transaction.status === 'cancelled' ? (
                                    <div>
                                        <div className="font-sm grey">
                                            Reason: {this.props.transaction.meta.comment}
                                        </div>
                                        <div className="font-sm grey">
                                            Cancelled By: {this.props.transaction.meta.cancelled_by ?
                                            this.props.transaction.meta.cancelled_by.username : ""}
                                        </div>
                                    </div>
                                ) : ("")}
                            </div>
                        </div>
                        <div className="divider-h mt-4 mb-4"/>
                        <div className="d-flex justify-content-center mr-5">
                            {this.props.partial_payment ? ("") :
                                (
                                    <div className={"mr-4"}>
                                        <a href={this.props.invoice_url} target="blank">
                                            <button className="button-solid lg">View Invoice</button>
                                        </a>
                                    </div>
                                )
                            }
                            {this.props.partial_payment ? (
                                <a
                                    href={`/admin/PartialHistory?userId=${
                                        this.props.userid
                                    }&cart_id=${this.props.cart_id}`}
                                    className="button-solid lg mr-4"
                                >
                                    View all Transactions
                                </a>
                            ) : (
                                ""
                            )}
                            {!this.props.partial_payment &&
                            this.props.status === "captured" && this.props.amount !== 0 ? (
                                <button
                                    className="button-solid lg"
                                    onClick={this.openModalHandler}
                                >
                                    Refund
                                </button>
                            ) : (
                                ""
                            )}
                            {this.props.status === "captured" && !this.props.partial_payment
                            && this.props.amount !== 0 ? (

                                <button
                                    onClick={this.handleCancelReceipt}
                                    className="button-solid lg"
                                    style={{marginLeft: "10vh"}}
                                >
                                    Cancel Receipt

                                </button>
                            ) : ("")}
                            <input id="orderIdInput" type="hidden"/>
                            <div className="row justify-content-center">
                                <a target="blank" id="anchorInvoiceUpdate"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CompleteOrder;
