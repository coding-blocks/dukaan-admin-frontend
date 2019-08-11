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
      completeTab: true,
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

  mapOptionsToValues = options => {
    return options.map(option => ({
      value: option.email,
      label: `${option.email} - ${option.username} - ${option.oneauth_id} - ${
        option.id
      }`
    }));
  };

  loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    }

    axios
      .get(`/api/v2/admin/users?email=${inputValue}`, {
        withCredentials: true
      })
      .then(res => {
        callback(this.mapOptionsToValues(res.data));
      });
  };

  handleEmailChange = selectedOption => {
    console.log(selectedOption.label.split("-")[3]);
    this.setState({
      id: selectedOption.label.split(" - ")[3]
    });
  };

  handleSearch = async e => {
    // e.preventDefault();
    if (!document.getElementById("email-search-form").checkValidity()) {
      document.getElementById("email-search-form").reportValidity();
    } else {
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
                {/* Form 2  */}
                {/* <div className="row ml-3 w-100 mt-4">
                  <div
                    className="col-12 col-md-4"
                    style={{ alignItems: "center" }}
                  >
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

                </div> */}
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
