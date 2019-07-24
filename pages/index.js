import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";
import CompleteOrders from "../components/CompleteOrder";
import AddUser from "../components/AddUser";
import NewPayment from "../components/NewPayment";
// import "semantic-ui-css/semantic.min.css";
// import axios from '../config'
import moment from "moment";
import axios from "axios";
import InCompleteOrder from "../components/InCompleteOrders";
import PartialPayments from "../components/PartialPayments";
import { resolve } from "url";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      completeTab: true,
      incompleteTab: false,
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
      incompleteTab: false
    }));
  };

  toggleIncompleteTab = () => {
    this.setState(prevstate => ({
      completeTab: false,
      incompleteTab: true
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
        `http://localhost:2929/api/v2/admin/users?email=${this.state.email}`,
        {
          withCredentials: true
        }
      )
      this.setState({
        userInfo: userData.data[0],
      });
  
      if (this.state.userInfo) {
        axios
          .get(
            `http://localhost:2929/api/v2/admin/purchases?user_id=${
              this.state.userInfo.id
            }`,
            {
              withCredentials: true
            }
          )
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
    }
    catch(e){
      this.setState({
        userFound: false
      })
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

    if (
      completeTab &&
      this.state.userFound &&
      this.state.courseInfo !== null &&
      !this.state.newpayment
    ) {
      // console.log(this.state.courseInfo, "hi");
      orders = this.state.courseInfo.completePayments.map(coursePurchased => {
        // console.log(coursePurchased, "heloooooooo");
        const date = moment(coursePurchased.created_at).format(
          "MMMM Do YYYY,h:mm:ss a"
        );
        // console.log(date);
        if (coursePurchased.cart !== null) {
          coursePurchased.cart.transactions.map(transaction => {
            // console.log(transaction, "hello");
          });

          return coursePurchased.cart.transactions.map(transaction => {
            return (
              <CompleteOrders
                date={date}
                txn_id={transaction.id}
                key={coursePurchased.id}
                image={coursePurchased.product.image_url}
                product_name={coursePurchased.product.name}
                status={transaction.status}
                amount={coursePurchased.amount / 100}
                invoice_url={coursePurchased.invoice_link}
                refunded={transaction.status}
                userid={this.state.userInfo.id}
                payment_type={transaction.payment_type}
              />
            );
            // console.log(coursePurchased.cart.transaction.payment_type);
          });
        }
      });
    } else if (completeTab) {
      orders = <div>No Complete Orders Found.</div>;
    } else if (InCompleteOrder) {
      if (this.state.courseInfo && this.state.courseInfo.partialPayments) {
        orders = this.state.courseInfo.partialPayments.map(partialPurchase => {
          console.log(partialPurchase, "Ppsds");
          const date = moment(partialPurchase.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          return (
            <InCompleteOrder
              amountLeft={partialPurchase.amountLeft}
              date={date}
              key={partialPurchase.id}
              image={partialPurchase.product.image_url}
              product_name={partialPurchase.product.name}
              amount={partialPurchase.amount / 100}
              created_at={partialPurchase.created_at}
              userid={this.state.userInfo.id}
              cart_id={partialPurchase.cart_id}
            />
          );
        });
      } else {
        orders = <div>No Incomplete Orders Found.</div>;
      }
    }

    const Usercard = () => {
      if (this.state.userFound && this.state.userInfo) {
        return (
          <div className=" mt-4">
            <div className="row w-100">
              <div className="col-md-4 col-12">
                <div className="border-card br-20 bg-light-grey mb-5">
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
                      Wallet Amount : ₹{" "}
                      {this.state.userInfo.wallet_amount / 100}
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
                  <div className="border-card br-20 bg-light-grey mb-5">
                    <div className="tab-nav-underline mb-5">
                      <div
                        className={
                          this.state.completeTab ? "tab active" : "tab"
                        }
                        onClick={this.toggleCompleteTab}
                      >
                        Complete Orders
                      </div>
                      <div
                        className={
                          this.state.incompleteTab ? "tab active" : "tab"
                        }
                        onClick={this.toggleIncompleteTab}
                      >
                        Incomplete Orders
                      </div>
                    </div>
                    {orders}
                  </div>
                </div>
              ) : (
                <NewPayment userid={this.state.userInfo.id} />
              )}
            </div>
          </div>
        );
      } else {
        return (
          <div className=" mt-4">
            <div className="row w-100">
              <div className="col-md-4 col-12">
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
                  value = {this.state.email}
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
          </div>
          {/* Form 2  */}
          <Usercard />

          {/* Order history card */}
        </div>
      </div>
    );
  }
}

export default Home;
