import React from "react";
import Link from "next/link";
import Head from "../components/Head";
import Layout from "../components/Layout";
import CompleteOrders from "../components/CompleteOrder";
import "./styles/index.scss";
import Price from "../components/Price";

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

  render() {
    const completeTab = this.state.completeTab;
    let orders;

    if (completeTab) {
      orders = <CompleteOrders />;
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
                  className="button-solid ml-4 mb-2"
                  style={{ fontSize: "1.3rem" }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Form 2  */}
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-12 col-12">
              <div className="border-card br-20 bg-light-grey mb-5">
                <h5>User Details</h5>
                <div style={{ alignItems: "center" }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12 p-4 username">
                        Ananay Arora (@ananay)
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-5 mt-1 p-4 userinfo">
                        <i className="fa fa-phone-square fa-2x icon_middle red" />
                        <span className="info">+919560043231</span>
                      </div>
                      <div className='col-md-2 p-4 red'>
                        <Price amount={1670} />
                      </div>
                      <div className="col-md-5 mt-1 p-4 userinfo">
                        <i className="fa fa-envelope fa-2x icon_middle red" />
                        <span className="info">i@ananayarora.com</span>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div className="col-md-12 mt-5" align="center">
                      <button className="button-solid p-4 h6">
                        Make New Payment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-12">
              <div className="border-card br-20 bg-light-grey mb-5">
                <div className="tab-nav-underline mb-5">
                  <div
                    className={this.state.completeTab ? "tab active" : "tab"}
                    onClick={this.toggleCompleteTab}
                  >
                    Complete Orders
                  </div>
                  <div
                    className={this.state.incompleteTab ? "tab active" : "tab"}
                    onClick={this.toggleIncompleteTab}
                  >
                    Incomplete Orders
                  </div>
                </div>
                {orders}
                {orders}
                {orders}
              </div>
            </div>
          </div>

          {/* Order history card */}
        </div>
      </div>
    );
  }
}

export default Home;
