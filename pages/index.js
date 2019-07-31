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
// import PartialPayments from "../components/PartialPayments";
import RefundedOrders from "../components/RefundedOrders";
import { resolve } from "url";
import userController from "../controllers/users";
import purchasesController from "../controllers/purchases";
import swal from "sweetalert2";
import "../controllers/config";
import ActiveOrders from "../components/ActiveOrders";
import UserCard from "../components/UserCard";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      completeTab: true,
      activeTab: false,
      refundedTab: false,
      userFound: false,
      userInfo: [],
      courseInfo: null,
      createUser: false,
      newpayment: false,
      refund: false,
      selectedUser: {}
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

  handleGetPaymentForUser = user => {
    purchasesController
      .handleGetPurchases(user.id)
      .then(res => {
        if (res.data) {
          this.setState({
            courseInfo: res.data
          });
        } else {
          this.setState({
            courseInfo: null
          });
        }
      })
      .catch(error => {
        swal.fire({
          title: "Error searching for user's purchases!",
          html: error,
          type: "error"
        });
      });
  };

  handleNewPayment = user => {
    this.setState({
      selectedUser: user,
      newpayment: true
    });
  };

  showOrders = user => {
    this.handleGetPaymentForUser(user);
    this.setState({
      selectedUser: user,
      newpayment: false
    });
  };

  handleSearch = async e => {
    e.preventDefault();
    if (!document.getElementById("email-search-form").checkValidity()) {
      document.getElementById("email-search-form").reportValidity();
    } else {
      userController
        .handleGetUserByEmail(this.state.email)
        .then(res => {
          if (res.data.length >= 1) {
            this.setState({
              userInfo: res.data,
              userFound: true
            });
          } else {
            this.setState({
              userFound: false
            });
          }
        })
        .catch(error => {
          swal.fire({
            title: "Error searching for user!",
            html: error,
            type: "error"
          });
        });
    }
  };

  handleCreateUser = () => {
    this.setState({
      createUser: true
    });
  };

  render() {
    let orders;
    const completeTab = this.state.completeTab;
    if (this.state.refundedTab) {
      if (this.state.courseInfo.refundedPayments.length > 0) {
        orders = this.state.courseInfo.refundedPayments.map(refundedOrder => {
          const date = moment(refundedOrder.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          const txn_obj = refundedOrder.cart.transactions.filter(
            transaction => transaction.status === "captured"
          );
          const txn_id = txn_obj[0].id;

          return (
            <RefundedOrders
              txn_id={txn_id}
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
        orders = <div>No Refunded Orders</div>;
      }
    }

    if (completeTab) {
      if (
        this.state.userFound &&
        this.state.courseInfo !== null &&
        !this.state.newpayment &&
        this.state.courseInfo.completedPayments.length > 0
      ) {
        orders = this.state.courseInfo.completedPayments.map(completeOrder => {
          const date = moment(completeOrder.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          return (
            <CompleteOrders
              date={date}
              txn_id={completeOrder.cart.transactions[0].id}
              key={completeOrder.id}
              image={completeOrder.product.image_url}
              product_name={completeOrder.product.name}
              status={completeOrder.status}
              amount={completeOrder.amount / 100}
              invoice_url={completeOrder.invoice_link}
              refunded={completeOrder.cart.transactions[0].status}
              userid={this.state.userInfo.id}
              payment_type={completeOrder.cart.transactions[0].payment_type}
              description={completeOrder.product.description}
              partial_payment={completeOrder.partial_payment}
              cart_id={completeOrder.cart.id}
            />
          );
        });
      } else {
        orders = <div>No Completed Orders found</div>;
      }
    } else if (this.state.activeTab) {
      if (
        this.state.courseInfo &&
        this.state.courseInfo.activePayments.length > 0
      ) {
        // console.log(activeOrder, "Ppsds");
        orders = this.state.courseInfo.activePayments.map(activeOrder => {
          const date = moment(activeOrder.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          return (
            <ActiveOrders
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

    return (
      <CheckLogin>
        <div>
          <Head title="Coding Blocks | Dukaan" />
          <Layout />
          {/* Search User */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className={"d-flex"}>
                  <form
                    id={"email-search-form"}
                    className={"d-flex col-md-12 px-0"}
                  >
                    <input
                      name="email"
                      required
                      autoFocus
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
                  </form>
                </div>
              </div>
              {/* Form 2  */}
              <div className="row mx-0 w-100 mt-4">
                {this.state.userInfo.length >= 1 && (
                  <div className={"col-md-4"}>
                    {this.state.userInfo.map(user => (
                      <div>
                        <UserCard
                          key={user.id}
                          userInfo={user}
                          showOrders={this.showOrders}
                          handleNewPayment={this.handleNewPayment}
                          newPaymentState={this.state.handleNewPayment}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {this.state.userInfo.length == 0 && (
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
                    {this.state.createUser ? <AddUser /> : ""}
                  </div>
                )}
                {!this.state.newpayment ? (
                  <div className="col-md-8 col-12">
                    <div className="border-card br-20 bg-light-grey mb-5 w-100">
                      <div className="tab-nav-underline mb-5">
                        <div
                          className={
                            this.state.activeTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleActiveTab}
                        >
                          Active Orders
                        </div>
                        <div
                          className={
                            this.state.completeTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleCompleteTab}
                        >
                          Completed Orders
                        </div>

                        <div
                          className={
                            this.state.refundedTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleRefundTab}
                        >
                          Refunded Orders
                        </div>
                      </div>
                      {orders}
                    </div>
                  </div>
                ) : (
                  <NewPayment userid={this.state.selectedUser.oneauth_id} />
                )}
              </div>
              {/* Order history card */}
            </div>
          </div>
        </div>
      </CheckLogin>
    );
  }
}

export default Home;
