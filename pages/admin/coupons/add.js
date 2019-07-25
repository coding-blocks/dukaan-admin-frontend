import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/coupons';
import "../../../styles/pages/admin/coupons.scss";
import Swal from 'sweetalert2';
import ProductsChooser from "../../../components/ProductsChooser";

class AddCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      queryParams: {
        authority_doc: "Coding Blocks",
        code: "",
        products: [],
        referrer_cashback: "",
        allProducts: "false",
        type: "online",
        mode: "flat",
        percentage: "",
        amount: 0,
        left: 0,
        category: "referral",
        active: "true",
        referrer: ""
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
   * Callback function for ProductsChooser component that updates
   * them in the state when ProductsChooser returns an array of 
   * products added
   * @param {array} products – Array of with the names of products
   */
  handleProductsChange = (products) => {
    let queryParams = this.state.queryParams;
    queryParams['products'] = products;
    this.setState({
      queryParams
    })
  }

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
        this.setState({
          loading: false
        });
        Swal.fire({
          title: "Coupon " + this.state.queryParams.code + " added!",
          type: "success",
          showConfirmButton: true
        });
      }).catch((error) => {
        this.setState({
          loading: false
        });
        Swal.fire({
          title: "Error adding coupon!",
          text: error,
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
              <form id="addCouponForm" onSubmit={(e) => e.preventDefault()}>
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
                      defaultValue={this.state.queryParams.code}
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
                      defaultValue={this.state.queryParams.category}
                      required
                    >
                      <option value="referral">Referral</option>
                      <option value="campus_ambassador">Campus Ambassador</option>
                      <option value="campaign">Campaign</option>
                      <option value="special_discount">Special Discount</option>
                    </select>
                  </FieldWithElement>

                  {this.state.queryParams.category == "referral" &&
                    <div>
                      {/* Referrer ID */}
                      <FieldWithElement name={"Referrer ID"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Enter Referrer ID"
                          name="referrer"
                          onChange={this.handleQueryParamChange}
                          required
                        />
                      </FieldWithElement>

                      {/* Referrer Cashback */}
                      <FieldWithElement name={"Cashback"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                        <input
                          type="text"
                          className="input-text"
                          placeholder="Enter Referrer Cashback"
                          name="referrer_cashback"
                          onChange={this.handleQueryParamChange}
                          defaultValue={this.state.queryParams.referrer_cashback}
                          pattern="[0-9]{1,10}"
                          title="Cashback must be a number"
                          required
                        />
                      </FieldWithElement>
                    </div>
                  }

                  {/* Products */}
                  <FieldWithElement name={"Products"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <ProductsChooser 
                      productsCallback={this.handleProductsChange}
                      multiple={true}
                    />
                  </FieldWithElement>

                  {/* Mode */}
                  <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      id="mode"
                      name="mode"
                      onChange={this.handleQueryParamChange}
                      defaultValue={this.state.queryParams.mode}
                      required
                    >
                      <option value="flat">Flat</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </FieldWithElement>

                  {this.state.queryParams.mode == "flat" && 
                    /* Amount */
                    <FieldWithElement 
                      name={"Amount"} 
                      nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <input
                        type="text"
                        className={"input-text"}
                        placeholder="Enter Amount"
                        name="amount"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.amount}
                        pattern="[0-9]{3,10}"
                        title="Amount can only have 3 to 10 digit numbers"
                        required
                      />
                    </FieldWithElement>
                  }

                  {this.state.queryParams.mode == "percentage" && 
                    /* Percentage */
                    <FieldWithElement 
                      name={"Percentage"} 
                      nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <input
                        type="text"
                        className={"input-text"}
                        placeholder="Enter Percentage"
                        name="percentage"
                        defaultValue={this.state.queryParams.percentage}
                        onChange={this.handleQueryParamChange}
                        required
                      />
                    </FieldWithElement>
                  }

                  {/* Left */}
                  <FieldWithElement name={"Left"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className={"input-text"}
                      placeholder="Enter Left"
                      name="left"
                      onChange={this.handleQueryParamChange}
                      defaultValue={this.state.queryParams.left}
                      pattern="[0-9]{1,10}"
                      title="Left can only have numbers"
                      required
                    />
                  </FieldWithElement>

                  {/* All Listed Products? */}
                  <FieldWithElement name={"All Listed Products?"} nameCols={5} elementCols={7} elementClassName={"pl-4"}>
                    <select
                      name="allProducts"
                      onChange={this.handleQueryParamChange}
                      defaultValue={this.state.queryParams.allProducts}
                    >
                      <option value={"false"}>No</option>
                      <option value={"true"}>Yes</option>
                    </select>
                  </FieldWithElement>

                  {/* Active */}
                  <FieldWithElement name={"Active"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <select
                      id="active"
                      name="active"
                      onChange={this.handleQueryParamChange}
                      defaultValue={this.state.queryParams.active}
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
