import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/Layout";
import Loader from '../../../components/loader';
import "../../../styles/pages/admin/coupons.scss";

class EditCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      couponID: props.router.query.id,
      loading: false
    };
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Edit Coupon" />
        <Layout />
        <div className={"border-card"}>
          {this.state.loading &&
            <Loader />
          }
        </div>
      </div>
    )
  }

}

export default withRouter(EditCoupon);