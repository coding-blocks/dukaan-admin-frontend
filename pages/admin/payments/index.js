import React from 'react';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import ErrorHandler from "../../../helpers/ErrorHandler";
import DukaanPaymentCard from "../../../components/partialComponents/DukaanPaymentCard";

const {getTransactionByRazorpayPaymentId} = require("../../../controllers/dukaanTransactions");

class DukaanPayments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            razorpayPayment: null,
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

    fetchDukaanPayments = () => {
        if (this.state.razorpayPaymentId) {
            getTransactionByRazorpayPaymentId(this.state.razorpayPaymentId).then((response) => {
                this.setState({
                    razorpayPayment: response.data.razorpayPayment,
                    razorpayResponse: response.data.razorpayResponse
                })
            }).catch((err) => {
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
                <Head title="System Transactions | Dukaan"/>
                <Layout>
                    <div className={"d-flex col-12 mt-4 ml-3 justify-content-center"}>

                        <div className="input-search w-75" style={{display: "inline-block"}}>
                            <input autoComplete={"off"} id="razorpayPaymentId" value={this.state.razorpayPaymentId} type="text"
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

                    <div>
                        {this.state.razorpayPayment ? <DukaanPaymentCard
                            razorpayPayment={this.state.razorpayPayment}
                            razorpayResponse={this.state.razorpayResponse}
                        /> : <div/>}
                    </div>

                    <div className={"container"}>
                        {
                            this.state.razorpayPayment ?
                                <button onClick={this.resetCurrentSearch} className="button-solid lg">Search
                                    New</button> : <div>

                                </div>
                        }
                    </div>


                </Layout>
            </div>


        </div>)
    }

}

export default DukaanPayments
