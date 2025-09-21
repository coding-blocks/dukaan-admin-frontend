import PartialPayments from "../../components/PartialPayments";
import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import moment from "moment";
import controller from "../../controllers/purchases";
import userController from "../../controllers/users";
import Link from "next/link";
import ErrorHandler from "../../helpers/ErrorHandler";

class PartialHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userId: "",
            cartId: "",
            partialPayments: null
        };
    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        controller.handleGetPartialPurchase(
            +params.get('userId'),
            +params.get('cart_id')
        ).then((payment) => {
            return Promise.all([
                payment,
                userController.handleGetUserById(params.get('userId'))
            ])
        }).then(([payment, userDetails]) => {
            this.setState({
                userId: params.get('userId'),
                cartId: params.get('cart_id'),
                userDetails: userDetails.data,
                firstname: userDetails.data.firstname,
                lastname: userDetails.data.lastname,
                partialPayments: payment.data.PartialPayments,
                mrp: payment.data.amount,
                productDescription: payment.data.product.description,
                isPaymentPartiallyPending: payment.data.status === 'partial'
            });
        }).catch((err) => {
            ErrorHandler.handle(err)
        });
    }

    renderPartialPayments = () => {
        if (this.state.partialPayments !== null) {
            return this.state.partialPayments.map(PartialPayment => {
                const date = moment(PartialPayment.created_at).format(
                    "MMMM Do YYYY,h:mm:ss a"
                );
                const mode = PartialPayment.transactions[0].payment_type;
                const center = mode !== 'razorpay' ? PartialPayment.transactions[0][mode].center.name : 'self';
                return (
                    <PartialPayments
                        key={PartialPayment.id}
                        date={date}
                        product_name={this.state.productDescription}
                        user_id={this.state.userId}
                        fee={PartialPayment.fee / 100}
                        tax_collected={PartialPayment.tax_collected / 100}
                        status={PartialPayment.status}
                        partial_amount={PartialPayment.partial_amount / 100}
                        partial_invoice_link={PartialPayment.partial_invoice_link}
                        id={PartialPayment.id}
                        payment_collected_by={`${PartialPayment.user.firstname}  ${
                            PartialPayment.user.lastname
                        }`}
                        mode={mode}
                        mrp={this.state.mrp / 100}
                        center={center}
                        txn_id={PartialPayment.transactions[0].id}
                        cart_id={PartialPayment.transactions[0].cart_id}
                    />
                );
            });
        }
    };

    render() {

        return (
            <div>
                <Head title="Partial Payments | Dukaan"/>
                <Layout/>

                <div className="container">
                    <div>
                        <div className={"row mt-3 ml-1"}>
                            <Link href={`/admin/orders?id=${this.state.userId}`}>
                                <i className="fas fa-arrow-left pointer" style={{"fontSize": "30px"}}/>
                            </Link>
                            <div className={"ml-4"}>
                                <h3 className="mb-2">List of Payment Installments made for this purchase</h3>
                                <div className="font-sm no-gutters">
                                    <div>
                                        <strong>{this.state.productDescription}</strong>
                                    </div>
                                    <strong>Order Total: </strong> ₹ {this.state.mrp / 100}
                                    <div>
                                        <strong>Purchased By:</strong> {this.state.firstname}{" "}
                                        {this.state.lastname}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.isPaymentPartiallyPending ? (
                            <Link
                                href={{
                                    pathname: `/admin/paymentInstallment`,
                                    query: {
                                        cartId: this.state.cartId,
                                    }
                                }}>
                                <button
                                    className="button-solid lg"
                                    style={{marginLeft: "10vh"}}>
                                    Make New Installment
                                </button>
                            </Link>
                        ) : <div/>}

                    </div>
                    <div className="item-heading row">{this.renderPartialPayments()}</div>
                </div>
            </div>
        );
    }
}

export default PartialHistory;
