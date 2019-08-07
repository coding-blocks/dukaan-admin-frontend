import React from "react";
import Head from "../components/head";
import Layout from "../components/layout";
import CompleteOrders from "../components/CompleteOrder";
import AddUser from "../components/AddUser";
import NewPayment from "../components/NewPayment";
import CheckLogin from "../components/CheckLogin";
import moment from "moment";
import InCompleteOrder from "../components/ActiveOrders";
import RefundedOrders from "../components/RefundedOrders";
import userController from "../controllers/users";
import purchasesController from "../controllers/purchases";
import swal from "sweetalert2";
import ActiveOrders from "../components/ActiveOrders";
import UserCard from "../components/UserCard";
import AsyncSelect from "react-select/async";
import _ from "lodash";

const customStyles = {
  option: provided => ({
    ...provided,
    height: "6vh",
    width: "100%"
  }),
  control: provided => ({
    ...provided,
    height: "6vh",
    width: "100%",
    borderRadius: "2vh",
    backgroundColor: "#f6f6f6"
  })
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: [],
      email: "",
      allTab: true,
      completeTab: false,
      activeTab: false,
      refundedTab: false,
      userFound: false,
      userInfo: [],
      courseInfo: [],
      createUser: false,
      newpayment: false,
      showOrders: false,
      refund: false,
      selectedUser: {}
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Creates the object that is used by react-select
   * to display options.
   * @param {object} options - Object to generate options for
   * @return {object}
   */
  mapOptionsToValues = options => {
    return options.map(option => ({
      value: option.email,
      label: option.email
    }));
  };

  /**
   * Used for fetching suggestions. Called by AsyncSelect
   * everytime the input field changes to load suggestions.
   * @param {string} inputValue - Value of the search box
   *  (in this case it is the email field)
   * @param {function} callback - Callback function with options
   *  that will be populated in the suggestions
   */
  loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }
    if (inputValue == "") {
      Swal.fire({
        type: "error",
        title: "Error searching for user!",
        text: "Email cannot be empty"
      })
    } else {
      userController.handleGetUserByEmail(inputValue).then((res) => {
        callback(this.mapOptionsToValues(res.data));
      }).catch((error) => {
        callback([]);
      })
    }
  };

  /**
   * Handles and sorts all orders based off different categories
   * (active, completed, refunded) to display them correctly in
   * the all orders tab.
   * @param {array} orders
   */
  handleAllOrders = (orders) => {
    orders.activePayments = orders.activePayments.map((p) => {
      p.type = "active";
      return p;
    });
    orders.completedPayments = orders.completedPayments.map((p) => {
      p.type = "completed";
      return p;
    });
    orders.refundedPayments = orders.refundedPayments.map((p) => {
      p.type = "refunded";
      return p;
    });
    let allOrders = [...orders.activePayments, ...orders.completedPayments, ...orders.refundedPayments];
    allOrders.sort((first, second) => {
      if (first.updated_at > second.updated_at) return -1;
      if (first.updated_at < second.updated_at) return 1;
    });
    let courseInfo = [];
    courseInfo.allOrders = allOrders;
    courseInfo.activePayments = orders.activePayments;
    courseInfo.completedPayments = orders.completedPayments;
    courseInfo.refundedPayments = orders.refundedPayments;
    this.setState({
      courseInfo
    });
  }

  /**
   * Handles the value that is of the selected option.
   * Not to be confused with the handleEmailTextboxChange
   * method below.
   * @param {object} selectedOption - The selected option
   */
  handleEmailChange = selectedOption => {
    this.setState({
      email: selectedOption.value
    });
  };

  /**
   * Handles the value in the react-select input box.
   * @param {string} email
   */
  handleEmailTextboxChange = (emailValue) => {
    this.setState({
      emailValue
    })
  }

  /**
   * Handles all the onChange events
   * associated with input fields
   */
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  /**
   * Handles tab switching based on the onclick event.
   * @param {SyntheticEvent} e
   */
  toggleTab = (e) => {
    let newState = {
      allTab: false,
      completeTab: false,
      activeTab: false,
      refundedTab: false
    };
    switch (e.target.innerHTML) {
      case 'All Orders':
        newState.allTab = true;
        break;
      case 'Active Orders':
        newState.activeTab = true;
        break;
      case 'Completed Orders':
        newState.completeTab = true;
        break;
      case 'Refunded Orders':
        newState.refundedTab = true;
        break;
    }
    this.setState(newState);
  }

  /**
   * Fetches the payments for a user
   * @param {object} user - User info object
   */
  handleGetPaymentForUser = user => {
    purchasesController
      .handleGetPurchases(user.id)
      .then(res => {
        if (res.data) {
          this.handleAllOrders(res.data);
        } else {
          this.setState({
            courseInfo: []
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

  /**
   * Shows the new payment form
   */
  handleNewPayment = user => {
    this.setState({
      selectedUser: user,
      newpayment: true,
      showOrders: false
    });
  };

  /**
   * Close the create user form
   */
  closeCreateUserForm = () => {
    this.setState({
      createUser: false
    });
  }

  /**
   * Calls the handle payment function 
   *  and changes the state accordingly
   * @param {object} user - User info
   */
  showOrders = user => {
    this.handleGetPaymentForUser(user);
    this.setState({
      selectedUser: user,
      newpayment: false,
      showOrders: true
    });
  };

  /**
   * Handles the search when the email search form is submitted.
   * @param {SyntheticEvent} e – Form submission event
   */
  handleSearch = async e => {
    e.preventDefault();
    if (!document.getElementById("email-search-form").checkValidity()) {
      document.getElementById("email-search-form").reportValidity();
    } else {
      if (this.state.email == "") {
        this.setState({
          email: this.state.emailValue
        })
      }
      userController
        .handleGetUserByEmail(this.state.email)
        .then(res => {
          if (res.data.length >= 1) {
            this.setState({
              userInfo: res.data,
              userFound: true,
              createUser: false
            });
          } else {
            this.setState({
              userFound: false,
              createUser: false
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

  /**
   * Shows the create user form
   */
  handleCreateUser = () => {
    this.setState({
      createUser: true
    });
  };

  render() {
    let orders;
    if (this.state.refundedTab) {
      if (
        this.state.courseInfo.refundedPayments &&
        this.state.courseInfo.refundedPayments.length > 0
      ) {
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
                key={refundedOrder.id}
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
              userid={this.state.userInfo[0].id}
              oneauthid={this.state.userInfo[0].oneauth_id}
              cart_id={refundedOrder.cart_id}
              partial_payment={refundedOrder.partial_payment}
              amount_refunded={refundedOrder.cart.transactions[0].amount_paid}
            />
          );
        });
      } else {
        orders = <div>No Refunded Orders Found.</div>;
      }
    }

    if (this.state.allTab) {
      if (
        this.state.userFound &&
        this.state.courseInfo !== null &&
        !this.state.newpayment &&
        this.state.courseInfo.allOrders &&
        this.state.courseInfo.allOrders.length > 0
      ) {
        orders = this.state.courseInfo.allOrders.map((order) => {
          if (order.type == "active") {
            const activeOrder = order;
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
                userid={this.state.userInfo[0].id}
                oneauthid={this.state.userInfo[0].oneauth_id}
                cart_id={activeOrder.cart_id}
                description={activeOrder.product.description}
              />
            );
          } else if (order.type == "completed") {
            const completeOrder = order;
            const date = moment(completeOrder.created_at).format(
              "MMMM Do YYYY, h:mm:ss a"
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
                userid={this.state.userInfo[0].id}
                payment_type={completeOrder.cart.transactions[0].payment_type}
                description={completeOrder.product.description}
                partial_payment={completeOrder.partial_payment}
                cart_id={completeOrder.cart.id}
              />
            );
          } else if (order.type == "refunded") {
            const refundedOrder = order;
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
                userid={this.state.userInfo[0].id}
                oneauthid={this.state.userInfo[0].oneauth_id}
                cart_id={refundedOrder.cart_id}
                partial_payment={refundedOrder.partial_payment}
                amount_refunded={refundedOrder.cart.transactions[0].amount_paid}
              />
            );
          }
        });
      } else {
        orders = <div>No orders to show</div>;
      }
    }

    if (this.state.completeTab) {
      if (
        this.state.userFound &&
        this.state.courseInfo !== null &&
        !this.state.newpayment &&
        this.state.courseInfo.completedPayments &&
        this.state.courseInfo.completedPayments.length > 0
      ) {
        orders = this.state.courseInfo.completedPayments.map(completeOrder => {
          const date = moment(completeOrder.created_at).format(
            "MMMM Do YYYY, h:mm:ss a"
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
              userid={this.state.userInfo[0].id}
              payment_type={completeOrder.cart.transactions[0].payment_type}
              description={completeOrder.product.description}
              partial_payment={completeOrder.partial_payment}
              cart_id={completeOrder.cart.id}
            />
          );
        });
      } else {
        orders = <div>No Completed Orders Found.</div>;
      }
    } else if (this.state.activeTab) {
      if (
        this.state.courseInfo.activePayments &&
        this.state.courseInfo.activePayments.length > 0
      ) {
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
              userid={this.state.userInfo[0].id}
              oneauthid={this.state.userInfo[0].oneauth_id}
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
      <div>
        <Head title="Coding Blocks | Dukaan" />
        <Layout />
        <CheckLogin>
          {/* Search User */}
          <div className="container mt-4">
            <div className="row">
              <div className="col-md-12 col-12">
                <div className={"d-flex"}>
                  <form
                    id={"email-search-form"}
                    className={"d-flex col-md-12 px-0"}
                  >
                    <div className="col-md-12 col-12">
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        placeholder="Enter Email.."
                        loadOptions={this.loadOptions}
                        onChange={this.handleEmailChange}
                        onInputChange={this.handleEmailTextboxChange}
                        autoFocus
                        styles={customStyles}
                      />
                    </div>

                    <button
                      id="search"
                      className="button-solid mb-1"
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
                      <div  key={user.id}>
                        <UserCard
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
                      <h5 style={{ textAlign: "center" }}>Search a user ? </h5>
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
                )}
                {!this.state.newpayment && this.state.showOrders &&
                  <div className="col-md-8 col-12">
                    <div className="border-card br-20 bg-light-grey mb-5 w-100">
                      <div className="tab-nav-underline mb-5">
                        <div
                          className={
                            this.state.allTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleTab}
                        >
                          All Orders
                        </div>
                        <div
                          className={
                            this.state.activeTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleTab}
                        >
                          Active Orders
                        </div>
                        <div
                          className={
                            this.state.completeTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleTab}
                        >
                          Completed Orders
                        </div>

                        <div
                          className={
                            this.state.refundedTab ? "tab active" : "tab"
                          }
                          onClick={this.toggleTab}
                        >
                          Refunded Orders
                        </div>
                      </div>
                      <div style={{ marginBottom: "1.8vh" }}>{orders}</div>
                    </div>
                  </div>
                }
                {this.state.newpayment && !this.state.showOrders &&
                  <NewPayment userid={this.state.selectedUser.oneauth_id} />
                }
              </div>
              {this.state.createUser ? <AddUser closeButtonCallback={this.closeCreateUserForm} /> : ""}
              {/* Order history card */}
            </div>
          </div>
        </CheckLogin>
      </div>
    );
  }
}

export default Home;
