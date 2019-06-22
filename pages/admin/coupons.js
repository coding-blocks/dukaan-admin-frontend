import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/Layout";
import "../../styles/pages/admin/coupons.scss";
import FieldWithElement from '../../components/FieldWithElement';
import Loader from '../../components/loader';
import controller from "../../controllers/admin/coupons.js";
import Link from 'next/link';

class Coupons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {
        code: "",
        category: "",
        product: "",
        mode: "",
        amount: "",
        percentage: "",
        active: "listed",
        listed: "no",
        resultsperpage: "10"
      },
      results: [],
      loading: false
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
   * Coupon search action method
   */
  handleCouponSearch = () => {
    this.setState({
      loading: true
    });
    controller.handleGetCoupons(this.state.queryParams).then((response) => {
      this.setState({
        loading: false,
        results: response
      });
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }

  /**
   * Coupon delete action method
   * @param {object} coupon
   */

  handleDeleteCoupon = (coupon) => {
    // TODO: Add Swal2 confirmation
    // Confirmation passed, delete coupon.
    controller.handleDeleteCoupon(coupon.id).then((response) => {
      // Remove the coupon from the table.
      let coupons = this.state.results;
      let couponIndex = this.state.results.indexOf(coupon);
      coupons.splice(couponIndex, 1);
      this.setState({
        results: coupons
      });
    });
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Coupons" />
        <Layout />
        <div class="d-flex mr-5 pr-5">
          <div class="d-flex align-items-center col-md-4 mt-2 ml-5">
            <div class="border-card coupon-card mt-2">
              {/* Title */}
              <div class="d-flex justify-content-center mt-1 pb-3">
                <h2 class="title">Search Coupons</h2>
              </div>

              {/* Code */}
              <FieldWithElement nameCols={3} elementCols={9} name={"Code"}>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="Enter Code"
                  name={"code"}
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>

              {/* Categories */}
              <FieldWithElement name={"Category"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <select 
                  id="category" 
                  name="category"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="">All Categories</option>
                  <option value="referral">Referral</option>
                  <option value="campus_ambassador">Campus Ambassador</option>
                  <option value="campaign">Campaign</option>
                  <option value="special_discount">Special Discount</option>
                </select>
              </FieldWithElement>
              
              {/* Products */}
              <FieldWithElement name={"Products"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <select
                  id="product" 
                  name="product"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="">All Products</option>
                </select>
              </FieldWithElement>

              {/* Mode */}
              <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <select 
                  id="mode" 
                  name="mode"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="">All Modes</option>
                  <option value="flat">Flat</option>
                  <option value="percentage">Percentage</option>
                </select>
              </FieldWithElement>

              {/* Amount */}
              <FieldWithElement name={"Amount"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="Enter Amount" 
                  name="amount"
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>

              {/* Percentage */}
              <FieldWithElement name={"Percentage"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <input 
                  type="text" 
                  className="input-text" 
                  placeholder="Enter Percentage" 
                  name="percentage"
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>

              {/* Active */}
              <FieldWithElement name={"Active"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                <select 
                  id="active" 
                  name="active"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </FieldWithElement>

              {/* Show only listed products? */}
              <FieldWithElement name={"Show only listed products?"} nameCols={7} elementCols={5} elementClassName={"pl-4"}>
                <select 
                  id="listed"
                  name="listed"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </FieldWithElement>
              
              {/* Results per page */}
              <FieldWithElement name={"Results per page"} nameCols={5} elementCols={7} elementClassName={"pl-4"}>
                <input 
                  type="text"
                  className="input-text"
                  placeholder="Enter Results Per Page..."
                  name="resultsperpage"
                  defaultValue={10}
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>
              <div class="d-flex justify-content-center">
                <button
                  id="search"
                  className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5"
                  onClick={this.handleCouponSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          
          {!this.state.loading && this.state.results.length > 0 &&
            <div class="d-flex ml-4 mt-3 col-md-8">
              <div class="border-card">
                {/* Title */}
                <div class="d-flex justify-content-center mt-1">
                  <h2 class="title">Coupon Results</h2>
                </div>
                {/* Results Table */}
                <div class="c-overview-leaderboard coupons-results">
                  <table class="table table-responsive coupons-results-table">
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Category</th>
                        <th>Referrer Cashback</th>
                        <th>Mode</th>
                        <th>Amount</th>
                        <th>Percentage</th>
                        <th>Left</th>
                        <th>Products</th>
                        <th>Active</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.results.map(coupon => (
                          <tr>
                            <td>{coupon.code}</td>
                            <td>{coupon.category}</td>
                            <td>{coupon.cashback}</td>
                            <td>{coupon.mode}</td>
                            <td>{coupon.amount}</td>
                            <td>{coupon.percentage}</td>
                            <td>{coupon.left}</td>
                            <td>{coupon.products}</td>
                            <td>{coupon.active}</td>
                            <td>
                              <Link as={`/admin/coupons/edit/${coupon.id}`} href={`/admin/coupons/edit?id=${coupon.id}`}>
                                <button class="button-solid btn btn-default">
                                  Edit
                                </button>
                              </Link>
                            </td>
                            <td>
                              <button class="button-solid btn btn-default" onClick={() => {this.handleDeleteCoupon(coupon)}}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
          {this.state.loading && 
            <div class="border-card mt-3">
              <Loader />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Coupons;