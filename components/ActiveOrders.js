import React from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import Price from "./Price";

class ActiveOrders extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cart_id: null,
            user_id: null
        }
    }

    componentDidMount() {
        this.setState({
            cart_id: this.props.cart_id,
            user_id: this.props.userid
        })
    }

    render() {
        return (
            <div className="row justify-content-center p-4" id="incomplete_orders_section">
                <div
                    className="border-card pt-4 mb-4"
                    style={{borderColor: "#ffad5f", borderWidth: ".2vh"}}>
                    <div className="row justify-content-between align-items-center">
                        <div className="col-md-7 col-12">
                            <div className="img-desc mb-4 mb-md-0">
                                <div className="col-md-3 col-4">
                                    <img className="round" src={this.props.image} alt=""/>
                                </div>
                                <div className="description justify-content-center">
                                    <div>
                                        <h4>{this.props.product_name}</h4>
                                        <div className="grey font-sm">{this.props.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="extra-bold mt-4 col-md-5">
                            <span className="font-mds red">Order Total</span>
                            <div className={"mt-2"}>
                                <Price amount={this.props.amount}/>
                            </div>
                        </div>
                    </div>

                    <div className="extra-bold mt-4 col-md-5">
                        <span className="font-mds red">Remaining Balance</span>{" "}
                        <div className={"mt-2"}>
                            <Price amount={this.props.amountLeft / 100}/>
                        </div>
                    </div>
                    <div className="font-sm grey mt-4">
                        Purchased on {this.props.date}
                    </div>

                    <div className="divider-h mt-4 mb-4"/>

                    <div className="row">
                        <Link
                            href={`/admin/PartialHistory?userId=${
                                this.props.userid
                            }&cart_id=${this.props.cart_id}`}>
                            <button className="button-solid view-partial-payment lg">
                                View all Transactions
                            </button>
                        </Link>

                        <Link
                            href={{
                                pathname: `/admin/paymentInstallment`,
                                query: {
                                    cartId: this.props.cart_id,
                                }
                            }}>
                            <button
                                className="button-solid lg"
                                style={{marginLeft: "10vh"}}>
                                Make Installment
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default ActiveOrders;
