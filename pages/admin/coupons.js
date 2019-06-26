import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/layout";
import "../../styles/pages/admin/coupons.scss";
import FieldWithElement from '../../components/FieldWithElement';
import Loader from '../../components/loader';
import controller from "../../controllers/admin/coupons.js";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EditCoupon from "./coupons/edit";
import Pagination from "../../components/Pagination";
import { randomBytes } from 'crypto';

class Coupons extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {
        code: "",
        category: "referral",
        product: "",
        mode: "flat",
        amount: "",
        active: "true",
        listed: "no",
        resultsperpage: 10
      },
      results: [],
      pagesInfo: {
        page: 1,
        limit: 10
      },
      loading: false
    };
    this.ReactSwal = withReactContent(Swal);
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
   * Callback for page change
   * @param {int} offset
   */
  handleChangePage = (offset) => {
    // let results_meta = this.state.results_meta;
    // results_meta.offset = offset;
    // this.setState({
    //   results_meta: results_meta
    // });
    // this.handleCouponSearch();
  }

  /**
   * Coupon search action method
   */
  handleCouponSearch = () => {
    this.setState({
      loading: true
    });
    controller.handleGetCoupons(this.state.queryParams, this.state.pagesInfo).then((response) => {
      this.setState({
        loading: false,
        results: response.results,
        pagesInfo: response.pagesInfo
      });
      console.log(this.state.pagesInfo);
      // console.log("results.length", response.results.length);
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
    Swal.fire({
      title: "Are you sure you want to delete coupon – " + coupon.code + " ?",
      type: 'question',
      confirmButtonColor: '#f66',
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, stop!",
      showCancelButton: true,
      showConfirmButton: true,
      showCloseButton: true
    }).then((result) => {
      if (result.value) {
         // Confirmation passed, delete coupon.
        controller.handleDeleteCoupon(coupon.id).then((response) => {
          // Remove the coupon from the table.
          let coupons = this.state.results;
          let couponIndex = this.state.results.indexOf(coupon);
          coupons.splice(couponIndex, 1);
          this.setState({
            results: coupons
          });
          // Show that the job is done
          Swal.fire({
            title: 'Coupon ' + coupon.code + ' Deleted!',
            type: "info",
            timer: '1500',
            showConfirmButton: true,
            confirmButtonText: "Okay"
          });
        }).catch((error) => {
          console.log("PROMISE REJECT");
          Swal.fire({
            title: "Error while deleting coupon!",
            html: "Error: " + error,
            type: "error",
            showConfirmButton: true
          });
        });
      }
    });
  }


  /**
   * Edit Coupon action handler.
   * @param {object} coupon
   */
  handleEditCoupon = (coupon) => {
    this.ReactSwal.fire({
      html: <EditCoupon
              coupon={coupon}
              callback={(newCoupon) => {
                this.ReactSwal.close();
                let coupons = this.state.results;
                let couponIndex = this.state.results.indexOf(coupon);
                coupons[couponIndex] = newCoupon;
                this.setState({
                  results: coupons
                });
              }} 
            />,
      customClass: "col-md-6",
      showConfirmButton: false
    });
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Coupons" />
        <Layout />
        <div className={"d-flex mr-5 pr-5"}>
          <div className={"d-flex align-items-center col-md-4 mt-2 ml-5"}>
            <div className={"border-card coupon-card mt-2"}>
              {/* Title */}
              <div className={"d-flex justify-content-center mt-1 pb-3"}>
                <h2 className={"title"}>
                    Search Coupons
                </h2>
              </div>

              {/* Code */}
              <FieldWithElement

                nameCols={3}
                elementCols={9}
                name={"Code"}>

              <input
                  type="text"
                  className={"input-text"}
                  placeholder="Enter Code"
                  name={"code"}
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>


              {/* Categories */}
              <FieldWithElement
                name={"Category"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
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
              <FieldWithElement
                name={"Products"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
                <select
                  id="product"
                  name="product"
                  onChange={this.handleQueryParamChange}
                >
                  <option value="">All Products</option>
                </select>
              </FieldWithElement>


              {/* Mode */}
              <FieldWithElement
                name={"Mode"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
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
              <FieldWithElement
                name={"Amount"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
                <input
                  type="text"
                  className={"input-text"}
                  placeholder="Enter Amount"
                  name="amount"
                  onChange={this.handleQueryParamChange}
                />
              </FieldWithElement>

              {/* Active */}
              <FieldWithElement
                name={"Active"}
                nameCols={3}
                elementCols={9}
                elementClassName={"pl-4"}
              >
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
              <FieldWithElement
                name={"Show only listed products?"}
                nameCols={7}
                elementCols={5}
                elementClassName={"pl-4"}
              >
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
              <FieldWithElement
                name={"Results per page"}
                nameCols={5}
                elementCols={7}
                elementClassName={"pl-4"}
              >
                <input
                  type="text"
                  className={"input-text"}
                  placeholder="Enter Results Per Page..."
                  name="limit"
                  defaultValue={10}
                  onChange={(event) => { 
                    let pagesInfo = this.state.pagesInfo;
                    pagesInfo['limit'] = event.target.value;
                    this.setState({
                      pagesInfo
                    });
                  }}
                />
              </FieldWithElement>

              <div className={"d-flex justify-content-center"}>
                <button
                  id="search"
                  className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                  onClick={this.handleCouponSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {!this.state.loading && this.state.results.length > 0 &&
            <div className={"d-flex ml-4 mt-3 col-md-8"}>
              <div className={"border-card"}>
                {/* Title */}
                <div className={"d-flex justify-content-center mt-1"}>
                  <h2 className={"title"}>Coupon Results</h2>
                </div>
                {/* Results Table */}
                <div className={"c-overview-leaderboard coupons-results"}>
                  <table className={"table table-responsive coupons-results-table"}>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Category</th>
                        <th>Referrer Cashback</th>
                        <th>Mode</th>
                        <th>Amount</th>
                        <th>Left</th>
                        <th>Products</th>
                        <th>Active</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.results.map(coupon => (
                          <tr key={coupon.id}>
                            <td>{coupon.code}</td>
                            <td>{coupon.category}</td>
                            <td>{coupon.referrer_cashback}</td>
                            <td>{coupon.mode}</td>
                            <td>{coupon.amount}</td>
                            <td>{coupon.left}</td>
                            <td>{coupon.products.length}</td>
                            <td>
                              {coupon.active && "True"}
                              {!coupon.active && "False"}
                            </td>
                            <td>
                              <button
                                className={"button-solid btn btn-default"}
                                onClick={() => {this.handleEditCoupon(coupon)}}>
                                Edit
                              </button>
                            </td>
                            <td>
                              <button
                                className={"button-solid btn btn-default"}
                                onClick={() => {this.handleDeleteCoupon(coupon)}}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <div className={"col-md-12 pt-4"}>
                  <Pagination 
                    pagesInfo={this.state.pagesInfo}
                    changePageCallback={this.handleChangePage}
                  />
                </div>
              </div>
            </div>
          }
          {this.state.loading &&
            <div className={"border-card mt-3"}>
              <Loader />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Coupons;
