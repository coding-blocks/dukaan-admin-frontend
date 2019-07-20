import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";
import CompleteOrders from "../components/CompleteOrder";
import AddUser from "../components/AddUser";
import NewPayment from "../components/NewPayment";
import CheckLogin from "../components/CheckLogin";
// import "semantic-ui-css/semantic.min.css";
import axios from "axios";

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
      newpayment: false
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
    this.setState({
      email: "",
      completeTab: true,
      incompleteTab: false,
      userFound: false,
      userInfo: {},
      courseInfo: null,
      createUser: false,
      newpayment: false
    });
    let userData = await axios.get(
      `http://localhost:2929/api/v2/admin/users?email=${this.state.email}`
    );
    this.setState({
      userInfo: userData.data[0]
    });

    console.log(userData.data[0]);
    if (this.state.userInfo) {
      axios
        .get(
          `http://localhost:2929/api/v2/admin/purchases?user_id=${
            this.state.userInfo.id
          }`
        )
        .then(res => {
          console.log(res);
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
      console.log(userData.data[0]);
    } else {
      console.log("no user found");
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
      console.log(this.state.courseInfo);
      orders = this.state.courseInfo.completePayments.map(coursePurchased => {
        // console.log(coursePurchased);
        return (
          <CompleteOrders
            key={coursePurchased.id}
            image={coursePurchased.product.image_url}
            product_name={coursePurchased.product.name}
            status={coursePurchased.cart.transactions[0].status}
            amount={coursePurchased.amount}
          />
        );
      });
    } else if (this.state.newpayment) {
      orders = <NewPayment />;
    } else if (completeTab) {
      orders = <div>No Complete Orders Found.</div>;
    } else {
      orders = <div>No Incomplete Orders Found.</div>;
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

                    <p>Wallet Amount : ₹ {this.state.userInfo.wallet_amount}</p>

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
                <NewPayment />
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
      </CheckLogin>
    );
  }
}

export default Home;
