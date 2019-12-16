import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import PaymentInstallmentForm from "../../components/PaymentInstallmentForm";
import {getPurchaseByCartId} from "../../controllers/purchases"
import ErrorHandler from "../../helpers/ErrorHandler";

class PaymentInstallment extends React.Component {

    constructor() {
        super();
        this.state = {
            purchase: ""
        }
    }

    static async getInitialProps({query}) {
        return {
            cart_id: query.cartId,
        };
    }

    componentDidMount() {
        getPurchaseByCartId(this.props.cart_id).then((response) => {
            this.setState({
                purchase: response.data[0]
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    render() {
        if (!this.state.purchase) {
            return (<div>
                <Head title={"Payment Installment"}/>
                <Layout/>
                <div>Loading...</div>
            </div>)
        }
        return (
            <div>
                <Head title={"Payment Installment"}/>
                <Layout/>
                <div className={"d-flex justify-content-center mt-5"}>
                    <PaymentInstallmentForm
                        id={this.state.purchase.cart.buyer_id}
                        oneauthId={this.state.purchase.cart.buyer.oneauth_id}
                        cart_id={this.state.purchase.cart_id}
                        amountLeft={this.state.purchase.amountLeft / 100}
                        minBase={this.state.purchase.product.emi_min_base}
                    />
                </div>
            </div>
        );
    }
}

export default PaymentInstallment;
