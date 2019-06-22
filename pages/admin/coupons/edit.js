import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/Layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/admin/coupons';
import "../../../styles/pages/admin/coupons/edit.scss";

class EditCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      couponID: props.router.query.id,
      loading: true,
      queryParams: {},
      couponInfo: {}
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
  handleSaveCoupon = () => {
    this.setState({
      loading: true
    });
    controller.handleSaveCoupon(this.state.queryParams).then((response) => {
      if (response == true) {
        this.setState({
          loading: false
        });
      }
    }).catch(() => {
      // TODO: Handle error here
    });
  }

  componentDidMount() {
    controller.handleGetCouponFromID(this.state.couponID).then((response) => {
      this.setState({
        couponInfo: response,
        loading: false
      });
    }).catch(() => {
      // TODO: Handle error here
    });
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Edit Coupon" />
        <Layout />
        <div className={"d-flex align-items-center justify-content-center"}>
          <div className={"border-card coupon-card col-md-4 mt-5"}>
            {this.state.loading &&
              <Loader />
            }
            {!this.state.loading &&
              <div className={"edit-coupon-card"}>

                {/* Title */}
                <div className={"d-flex justify-content-center mt-1 pb-3"}>
                  <h2 className={"title"}>Edit Coupon</h2>
                </div>

                {/* Code */}
                <FieldWithElement name={"Code"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <input 
                    type="text"
                    className="input-text" 
                    placeholder="Enter Code"
                    name="code"
                    defaultValue={this.state.couponInfo.code}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Categories */}
                <FieldWithElement name={"Category"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <select 
                    id="category" 
                    name="category"
                    defaultValue={this.state.couponInfo.category}
                    onChange={this.handleQueryParamChange}
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
                    defaultValue={this.state.couponInfo.cashback}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Mode */}
                <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <select 
                    id="mode"
                    name="mode"
                    defaultValue={this.state.couponInfo.mode}
                    onChange={this.handleQueryParamChange}
                  >
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
                    defaultValue={this.state.couponInfo.amount}
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
                    defaultValue={this.state.couponInfo.percentage}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Left */}
                <FieldWithElement name={"Left"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="Enter Left"
                    name="left"
                    defaultValue={this.state.couponInfo.left}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Products */}
                <FieldWithElement name={"Products"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="Enter Products"
                    name="products"
                    defaultValue={this.state.couponInfo.products}
                    onChange={this.handleQueryParamChange}
                  />
                </FieldWithElement>

                {/* Active */}
                <FieldWithElement name={"Active"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <select 
                    id="active" 
                    name="active"
                    defaultValue={this.state.couponInfo.active}
                    onChange={this.handleQueryParamChange}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </FieldWithElement>
                <div class="d-flex justify-content-center">
                  <button
                    id="search"
                    className="button-solid ml-4 mb-2 mt-4 pl-5 pr-5"
                    onClick={this.handleSaveCoupon}
                  >
                    Save
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }

}

export default withRouter(EditCoupon);