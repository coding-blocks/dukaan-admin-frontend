import PartialPayments from "../../components/PartialPayments";
import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import moment from "moment";
import controller from "../../controllers/purchases";
import userController from "../../controllers/users";
import Link from "next/link";

class PartialHistory extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userid: "",
            cart_id: "",
            courseInfo: null
        };
    }

    componentDidMount() {
        const userid = window.location.search.split("&")[0].split("=")[1];
        const cart_id = window.location.search.split("&")[1].split("=")[1];
        this.setState({
            userid,
            cart_id
        });
        controller
            .handleGetPartialPurchases(userid, cart_id)
            .then(res => {
                userController.handleGetUserById(userid).then(res2 => {
                    console.log(res.data, "ppppp");
                    this.setState({
                        firstname: res2.data.firstname,
                        lastname: res2.data.lastname,
                        courseInfo: res.data.PartialPayments,
                        mrp: res.data.amount,
                        name: res.data.product.description
                    });
                });
            })
            .catch(err => {
                this.setState({
                    courseInfo: null
                });
            });
    }

    render() {
        const partial = () => {
            if (this.state.courseInfo !== null) {
                return this.state.courseInfo.map(PartialPayment => {
                    const date = moment(PartialPayment.created_at).format(
                        "MMMM Do YYYY,h:mm:ss a"
                    );
                    const mode = PartialPayment.transactions[0].payment_type;
                    const center = mode !== 'razorpay' ? PartialPayment.transactions[0][mode].center.name : 'self';
                    return (
                        <PartialPayments
                            key={PartialPayment.id}
                            date={date}
                            Productname={this.state.name}
                            userid={this.state.userid}
                            fee={PartialPayment.fee / 100}
                            tax_collected={PartialPayment.tax_collected / 100}
                            status={PartialPayment.status}
                            partial_amount={PartialPayment.partial_amount / 100}
                            partial_invoice_link={PartialPayment.partial_invoice_link}
                            id={PartialPayment.id}
                            name={`${PartialPayment.user.firstname}  ${
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
        return (
            <div>
                <Head title="Partial Payments | Dukaan"/>
                <Layout/>

                <div className="container">
                    <div>
                        <div className={"row mt-3 ml-1"}>
                            <Link href={`/admin/orders?id=${this.state.userid}`}>
                                <i className="fas fa-arrow-left pointer" style={{"fontSize": "30px"}}/>
                            </Link>
                            <div className={"ml-4"}>
                                <h3 className="mb-2">List of Payment Installments made for this purchase</h3>
                                <div className="font-sm no-gutters">
                                    <div>
                                        <strong>{this.state.name}</strong>
                                    </div>
                                    <strong>Order Total: </strong> ₹ {this.state.mrp / 100}
                                    <div>
                                        <strong>Purchased By:</strong> {this.state.firstname}{" "}
                                        {this.state.lastname}
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <div className="item-heading row">{partial()}</div>
                </div>
            </div>
        );
    }
}

export default PartialHistory;
