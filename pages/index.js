import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      completeTab: true,
      incompleteTab: false
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  toggleTab = () => {
    this.setState(prevstate => ({
      completeTab: !prevstate.completeTab,
      incompleteTab: !prevstate.incompleteTab
    }));
  };

  render() {
    const completeTab = this.state.completeTab;
    let orders;

    if (completeTab) {
      orders = <div>Completed Orders.</div>;
    } else {
      orders = <div>No Incomplete Orders Found.</div>;
    }

    return (
      <div>
        <Head title="Coding Blocks | Dukaan" />
        <Layout />

        {/* Search User */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="border-card br-20 bg-light-grey mb-5">
                <h5 className="mb-3">Find User</h5>
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
                  <button id="search" className="button-solid ml-4 mb-1">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Form 2  */}
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="border-card br-20 bg-light-grey mb-5">
                <h5>User Details</h5>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p
                    style={{ margin: "1.6vh", marginLeft: "0" }}
                    className="red"
                  >
                    Username : Tathagat2006
                  </p>

                  <p style={{ margin: "1.6vh" }}>Name : Tathagat Thapliyal</p>

                  <p style={{ margin: "1.6vh" }}>
                    Email : tathagat.thapliyal@gmail.com
                  </p>

                  <p style={{ margin: "1.6vh" }}>Mobile : +91-7503681329</p>

                  <p style={{ margin: "1.6vh" }}>Wallet Amount : ₹ 2320</p>

                  <div>
                    <button className="button-solid">Make New Payment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order history card */}
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="border-card br-20 bg-light-grey mb-5">
                <div className="tab-nav-underline mb-5">
                  <div
                    className={this.state.completeTab ? "tab active" : "tab"}
                    onClick={this.toggleTab}
                  >
                    Completed Orders
                  </div>
                  <div
                    className={this.state.incompleteTab ? "tab active" : "tab"}
                    onClick={this.toggleTab}
                  >
                    Incomplete Orders
                  </div>
                </div>
                {orders}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
