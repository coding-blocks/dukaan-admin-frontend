import React from 'react';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import ErrorHandler from "../../../helpers/ErrorHandler";

const {getTransactionByRazorpayPaymentId} = require("../../../controllers/dukaanTransactions");

class DukaanPayments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            payments: undefined,
            formValues: {
                razorpayPaymentId: ""
            }

        }

    }


    componentDidMount() {

    }

    onChangeValue = e => {
        let newFormValues = this.state.formValues;
        newFormValues[e.target.name] = e.target.value;
        this.setState({
            formValues: newFormValues
        });
    };

    fetchDukaanPayments() {
        if (this.state.formValues.razorpayPaymentId) {
            getTransactionByRazorpayPaymentId(this.state.formValues.razorpayPaymentId).then((response) => {
                console.log('Payments is', response)
            }).catch((err) => {
                ErrorHandler.handle(err)
            })
        }

    }

    render() {

        return (<div>


            <div>
                <Head title="System Transactions | Dukaan"/>
                <Layout>
                    <div className={"d-flex col-12 mt-4 ml-3 justify-content-center"}>

                        <div className="input-search w-75" style={{display: "inline-block"}}>
                            <input id="razorpayPaymentId" value={this.state.formValues.razorpayPaymentId} type="text"
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

                    </div>
                </Layout>
            </div>


        </div>)
    }

}

export default DukaanPayments
