import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";
import CompleteOrders from "../components/CompleteOrder";
import AddUser from "../components/AddUser";
import NewPayment from "../components/NewPayment";
import CheckLogin from "../components/CheckLogin";
// import "semantic-ui-css/semantic.min.css";
import "../controllers/config";
import moment from "moment";
import axios from "axios";
import InCompleteOrder from "../components/ActiveOrders";
// import PartialPayments from "../components/PartialPayments";
import RefundedOrders from "../components/RefundedOrders";
import { resolve } from "url";
import "../controllers/config";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      completeTab: true,
      activeTab: false,
      refundedTab: false,
      userFound: false,
      userInfo: null,
      courseInfo: null,
      createUser: false,
      newpayment: false,
      refund: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  toggleCompleteTab = () => {
    this.setState(prevstate => ({
      completeTab: true,
      activeTab: false,
      refundedTab: false
    }));
  };

  toggleActiveTab = () => {
    this.setState(prevstate => ({
      completeTab: false,
      activeTab: true,
      refundedTab: false
    }));
  };

  toggleRefundTab = () => {
    this.setState(prevstate => ({
      completeTab: false,
      activeTab: false,
      refundedTab: true
    }));
  };

  handleNewPayment = () => {
    this.setState({
      newpayment: true
    });
  };

  handleSearch = async () => {
    let userData;
    try {
      userData = await axios.get(
        `/api/v2/admin/users?email=${this.state.email}`
      );
      this.setState({
        userInfo: userData.data[0]
      });

      if (this.state.userInfo) {
        axios
          .get(`/api/v2/admin/purchases?user_id=${this.state.userInfo.id}`)
          .then(res => {
            // console.log(res);
            this.setState({
              courseInfo: res.data
            });
          })
          .catch(err => {
            console.log(err);
            this.setState({
              courseInfo: null
            });
          });
      }

      if (userData) {
        this.setState({
          userFound: true
        });
      }
    } catch (e) {
      this.setState({
        userFound: false
      });
    }
  };

  handleCreateUser = () => {
    console.log("clicked");
    this.setState({
      createUser: true
    });
  };

  render() {
    let orders;
    const completeTab = this.state.completeTab;
    if (this.state.refundedTab) {
      if (this.state.courseInfo.refundedPayments.length > 0) {
        // console.log("refunded", this.state.courseInfo.refundedPayments);
        orders = this.state.courseInfo.refundedPayments.map(refundedOrder => {
          console.log(refundedOrder, "order");
          const date = moment(refundedOrder.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          return (
            <RefundedOrders
              status={refundedOrder.status}
              description={refundedOrder.product.description}
              invoice_url={refundedOrder.invoice_link}
              amountLeft={refundedOrder.amountLeft}
              partial_payment={refundedOrder.partial_payment}
              date={date}
              key={refundedOrder.id}
              image={refundedOrder.product.image_url}
              product_name={refundedOrder.product.name}
              amount={refundedOrder.amount / 100}
              created_at={refundedOrder.created_at}
              userid={this.state.userInfo.id}
              oneauthid={this.state.userInfo.oneauth_id}
              cart_id={refundedOrder.cart_id}
              partial_payment={refundedOrder.partial_payment}
              amount_refunded={refundedOrder.cart.transactions[0].amount_paid}
            />
          );
        });
      } else {
        console.log("refunded", "fdjhvhjsdgvjhsj");
        orders = <div>No Refunded Orders</div>;
      }
    }

    if (
      completeTab &&
      this.state.userFound &&
      this.state.courseInfo !== null &&
      !this.state.newpayment
    ) {
      // console.log(this.state.courseInfo, "hi");
      // if (this.state.courseInfo.completePayments !== null) {
      orders = this.state.courseInfo.completedPayments.map(order => {
        const date = moment(order.created_at).format("MMMM Do YYYY,h:mm:ss a");

        console.log(order);
        return (
          <CompleteOrders
            date={date}
            txn_id={order.cart.transactions[0].id}
            key={order.id}
            image={order.product.image_url}
            product_name={order.product.name}
            status={order.status}
            amount={order.amount / 100}
            invoice_url={order.invoice_link}
            refunded={order.cart.transactions[0].status}
            userid={this.state.userInfo.id}
            payment_type={order.cart.transactions[0].payment_type}
            description={order.product.description}
          />
        );
      });
      // }
    } else if (completeTab) {
      orders = <div>No Complete Orders Found.</div>;
    } else if (this.state.activeTab) {
      if (
        this.state.courseInfo &&
        this.state.courseInfo.activePayments.length > 0
      ) {
        orders = this.state.courseInfo.activePayments.map(activeOrder => {
          console.log(activeOrder, "Ppsds");
          const date = moment(activeOrder.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          return (
            <InCompleteOrder
              amountLeft={activeOrder.amountLeft}
              partial_payment={activeOrder.partial_payment}
              date={date}
              status={activeOrder.status}
              key={activeOrder.id}
              image={activeOrder.product.image_url}
              product_name={activeOrder.product.name}
              amount={activeOrder.amount / 100}
              created_at={activeOrder.created_at}
              userid={this.state.userInfo.id}
              oneauthid={this.state.userInfo.oneauth_id}
              cart_id={activeOrder.cart_id}
              description={activeOrder.product.description}
            />
          );
        });
      } else {
        orders = <div>No Active Orders Found.</div>;
      }
    }

    const Usercard = () => {
      if (this.state.userFound && this.state.userInfo) {
        return (
          <div className="row w-100 mx-0 mt-4">
            <div className="col-md-4 col-12">
              <div className="border-card br-20 bg-light-grey mb-5 w-100">
                <h5>User Details</h5>
                <div
                  style={{
                    alignItems: "center"
                  }}
                >
                  <p className="red">
                    Username : {this.state.userInfo.username}
                  </p>

                  <p>
                    Name : {this.state.userInfo.firstname}{" "}
                    {this.state.userInfo.lastname}
                  </p>

                  <p>Email : {this.state.userInfo.email}</p>

                  <p>Mobile : {this.state.userInfo.mobile_number}</p>

                  <p>
                    Wallet Amount : ₹ {this.state.userInfo.wallet_amount / 100}
                  </p>

                  <div>
                    <button
                      className="button-solid"
                      onClick={this.handleNewPayment}
                    >
                      Make New Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {!this.state.newpayment ? (
              <div className="col-md-8 col-12">
                <div className="border-card br-20 bg-light-grey mb-5 w-100">
                  <div className="tab-nav-underline mb-5">
                    <div
                      className={this.state.activeTab ? "tab active" : "tab"}
                      onClick={this.toggleActiveTab}
                    >
                      Active Orders
                    </div>
                    <div
                      className={this.state.completeTab ? "tab active" : "tab"}
                      onClick={this.toggleCompleteTab}
                    >
                      Completed Orders
                    </div>

                    <div
                      className={this.state.refundedTab ? "tab active" : "tab"}
                      onClick={this.toggleRefundTab}
                    >
                      Refunded Orders
                    </div>
                  </div>
                  {orders}
                </div>
              </div>
            ) : (
              <NewPayment userid={this.state.userInfo.oneauth_id} />
            )}
          </div>
        );
      } else {
        return (
          <div className=" mt-4 ml-3 w-100">
            <div className="row">
              <div className="col-12 col-md-4">
                <div className="border-card br-20 bg-light-grey mb-5">
                  <h5 style={{ textAlign: "center" }}>
                    No user Found, Search Existing?{" "}
                  </h5>
                  <h5 className="mt-4" style={{ textAlign: "center" }}>
                    OR
                  </h5>
                  <div style={{ textAlign: "center" }}>
                    <button
                      className="button-solid p-3 mt-4"
                      onClick={this.handleCreateUser}
                    >
                      Create New User
                    </button>
                  </div>
                </div>
              </div>
              {this.state.createUser ? <AddUser /> : ""}
            </div>
          </div>
        );
      }
    };

    return (
      <CheckLogin>
        <div>
          <Head title="Coding Blocks | Dukaan" />
          <Layout />
          {/* Search User */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-12 col-12">
                <div style={{ display: "flex" }}>
                  <input
                    name="email"
                    required
                    id="email"
                    type="email"
                    className="input-text mb-2"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <button
                    id="search"
                    className="button-solid ml-4 mb-1"
                    style={{ fontSize: "1.3rem" }}
                    onClick={this.handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
              {/* Form 2  */}
              <Usercard />
              {/* Order history card */}
            </div>
          </div>
        </div>
      </CheckLogin>
    );
  }
}

export default Home;
