import React from "react";
import Link from "next/link";
import Head from "../components/head";
import Layout from "../components/layout";
import AddUser from "../components/AddUser";
import CheckLogin from "../components/CheckLogin";
import userController from "../controllers/users";
import swal from "sweetalert2";
import AsyncSelect from "react-select/async";

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

import axios from "axios";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      suggestions: [],
      email: "",
      allTab: true,
      completeTab: false,
      activeTab: false,
      refundedTab: false,
      userFound: false,
      userInfo: [],
      courseInfo: {},
      createUser: false,
      newpayment: false,
      selectedUser: {}
    };
    // this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.setState({
      createUser: true
    });

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
      label: `${option.email} - ${option.username} - ${option.oneauth_id} - ${
        option.id
      }`
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
    console.log(selectedOption.label.split("-")[3]);
    this.setState({
      id: selectedOption.label.split(" - ")[3]
    });
  };

  /**
   * Handles the search when the email search form is submitted.
   * @param {SyntheticEvent} e – Form submission event
   */
  handleSearch = async e => {
    // e.preventDefault();
    if (!document.getElementById("email-search-form").checkValidity()) {
      document.getElementById("email-search-form").reportValidity();
    } else {
      if (this.state.email == "") {
        this.setState({
          email: this.state.emailValue
        })
      }
      userController
        .handleGetUserById(this.state.id)
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
    return (
      <CheckLogin>
        <div>
          <Head title="Coding Blocks | Dukaan" />
          <Layout>
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
                          styles={customStyles}
                        />
                      </div>

                      <Link href={`/admin/user?id=${this.state.id}`}>
                        <button
                          id="search"
                          className="button-solid mb-1"
                          style={{ fontSize: "1.3rem" }}
                          onClick={this.handleSearch}
                        >
                          Search
                        </button>
                      </Link>
                    </form>
                  </div>
                </div>
                {this.state.createUser ? <AddUser /> : ""}
              </div>
            </div>
          </Layout>
        </div>
      </CheckLogin>

    );
  }
}

export default Home;
