import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/Layout";
import "../styles/admin/coupons.scss";
import FieldWithElement from '../../components/FieldWithElement';
class Coupons extends React.Component {
  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Coupons" />
        <Layout />
        <div class="d-flex justify-content-center align-items-center mt-5">
          <div class="border-card coupon-card">
            <div class="d-flex justify-content-center mt-2 pb-3">
              <h1 class="title">Search Coupons</h1>
            </div>
            {/* Code */}
            <FieldWithElement nameCols={3} elementCols={9} name={"Code"}>
              <input type="text" className="input-text" placeholder="Enter Code" />
            </FieldWithElement>

            {/* Categories */}
            <div>
              <select id="category" name="category" className="mt-4 col-md-12">
                <option value="">All Categories</option>
                <option value="referral">Referral</option>
                <option value="campus_ambassador">Campus Ambassador</option>
                <option value="campaign">Campaign</option>
                <option value="special_discount">Special Discount</option>
              </select>
            </div>
            
            {/* Products */}
            <div class="mt-4"  className="col-md-12">
              <select id="product" name="product">
                <option value="">All Products</option>
              </select>
            </div>

            {/* Mode */}
            <div class="mt-4" className="col-md-12">
              <select id="mode" name="mode">
                <option value="">All Modes</option>
                <option value="flat">Flat</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            {/* Amount */}
            <FieldWithElement name={"Amount"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
              <input type="text" className="input-text" placeholder="Enter Amount" />
            </FieldWithElement>

            {/* Percentage */}
            <FieldWithElement name={"Percentage"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
              <input type="text" className="input-text" placeholder="Enter Percentage" />
            </FieldWithElement>

            {/* Active */}
            <FieldWithElement name={"Active"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
              <select id="active" name="active">
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </FieldWithElement>
          </div>
        </div>
      </div>
    );
  }
}

export default Coupons;