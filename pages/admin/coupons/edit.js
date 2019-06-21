import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/Layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import "../../../styles/pages/admin/coupons/edit.scss";

class EditCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      couponID: props.router.query.id,
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

  componentDidMount() {

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
                  />
                </FieldWithElement>

                {/* Mode */}
                <FieldWithElement name={"Mode"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <select 
                    id="mode"
                    name="mode"
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

                {/* Left */}
                <FieldWithElement name={"Left"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <input 
                    type="text" 
                    className="input-text" 
                    placeholder="Enter Left"
                    name="left"
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

              </div>
            }
          </div>
        </div>
      </div>
    )
  }

}

export default withRouter(EditCoupon);