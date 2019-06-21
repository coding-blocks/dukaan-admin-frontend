import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/Layout";

class EditCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      couponID: props.router.query.id
    };
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Edit Coupons" />
        <Layout />
      </div>
    )
  }

}

export default withRouter(EditCoupon);