import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import axios from "axios";
import ContinuePayment from "../../components/ContinuePayment";

class continuePayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cart_id: null,
      userid: null,
      courseInfo: null,
      formValues: {}
    };
  }
  componentDidMount() {
    const cart_id = window.location
      .toString()
      .split("=")[1]
      .substring(0, 3);
    const userid = window.location.toString().split("=")[2];
    console.log(cart_id, "CART");
    console.log(userid, "USERID");
    this.setState({
      cart_id: cart_id,
      userid
    });

    console.log(this.state);
  }

  render() {
    return (
      <div>
        <Head />
        <Layout />
        <ContinuePayment
          oneauthId={this.state.userid}
          cart_id={this.state.cart_id}
        />
      </div>
    );
  }
}

export default continuePayment;
