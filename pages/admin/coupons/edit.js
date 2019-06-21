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
}

export default withRouter(EditCoupon);