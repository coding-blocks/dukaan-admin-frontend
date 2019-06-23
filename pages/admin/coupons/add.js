import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/Layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/admin/coupons';
import "../../../styles/pages/admin/coupons.scss";
import Swal from 'sweetalert2';

class AddCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      queryParams: {
        code: "",
        category: 'referral',
        cashback: "",
        mode: 'Flat',
        amount: "",
        left: "",
        products: 'CB',
        active: 'true'
      },
    };
  }

  /**
   * Changes the value of the specified key in the queryParams object
   * in state.
   * @param {SyntheticEvent} event – Handles an event from a form
   * @example
   *  <input
   *   type="text"
   *   name="email"
   *   onChange={this.handleQueryParamChange}
   *  />
   *  // Changes the value of this.state.queryParams.email
   */
  handleQueryParamChange = (event) => {
    let newQueryParams = this.state.queryParams;
    newQueryParams[event.target.name] = event.target.value;
    this.setState(prevState => ({
      queryParams: newQueryParams
    }));
  };

  /**
   * Method to handle saving of coupon
   */
  handleAddCoupon = (event) => {
    event.preventDefault();
    // Show the loading icon
    if (!document.getElementById("addCouponForm").checkValidity()) {
      document.getElementById("addCouponForm").reportValidity();
    } else {
      this.setState({
        loading: true
      });
      controller.handleAddCoupon(this.state.queryParams).then((response) => {
        if (response == true) {
          this.setState({
            loading: false
          });
          Swal.fire({
            title: "Coupon " + this.state.queryParams.code + " added!",
            type: "success",
            showConfirmButton: true
          });
        }
      }).catch((error) => {
        Swal.fire({
          title: "Error adding coupon!",
          text: "Error: " + error,
          type: "error",
          showConfirmButton: true
        });
      });
    }
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Add Coupon" />
        <Layout />
        <div className={"d-flex align-items-center justify-content-center"}>
          <div className={"border-card coupon-card col-md-4 mt-5"}>
            {this.state.loading &&
              <Loader />
            }
            {!this.state.loading &&
              <form id="addCouponForm">
                <div className={"add-coupon-card"}>

                  {/* Title */}
                  <div className={"d-flex justify-content-center mt-1 pb-3"}>
                    <h2 className={"title"}>Add Coupon</h2>
                  </div>

                  {/* Code */}
                  <FieldWithElement name={"Code"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Code"
                      name="code"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Categories */}
                  <FieldWithElement name={"Category"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      id="category"
                      name="category"
                      onChange={this.handleQueryParamChange}
                      required
                    >
                      <option value="referral">Referral</option>
                      <option value="campus_ambassador">Campus Ambassador</option>
                      <option value="campaign">Campaign</option>
                      <option value="special_discount">Special Discount</option>
                    </select>
                  </FieldWithElement>

                  {/* Cashback */}
                  <FieldWithElement name={"Cashback"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Referrer Cashback"
                      name="cashback"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Mode */}
                  <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      id="mode"
                      name="mode"
                      onChange={this.handleQueryParamChange}
                      required
                    >
                      <option value="flat">Flat</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </FieldWithElement>

                  {/* Amount */}
                  <FieldWithElement name={"Amount"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className={"input-text"}
                      placeholder="Enter Amount"
                      name="amount"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Left */}
                  <FieldWithElement name={"Left"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className={"input-text"}
                      placeholder="Enter Left"
                      name="left"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Products */}
                  <FieldWithElement name={"Products"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className={"input-text"}
                      placeholder="Enter Products"
                      name="products"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Active */}
                  <FieldWithElement name={"Active"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      id="active"
                      name="active"
                      onChange={this.handleQueryParamChange}
                      required
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </FieldWithElement>
                  <div className={"d-flex justify-content-center"}>
                    <button
                      id="search"
                      className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                      onClick={this.handleAddCoupon}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    )
  }

}

export default withRouter(AddCoupon);
