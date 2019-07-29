import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import ContinuePayment from "../../components/ContinuePayment";

class continuePayment extends React.Component {
  static async getInitialProps({ query }) {
    console.log(query, "dsjhdjhs");
    return {
      oneauthid: query.oneauthid,
      cart_id: query.cartid,
      amountLeft: query.amountLeft
    };
  }
  constructor(props) {
    super(props);
    this.state = {
      cart_id: "",
      userid: "",
      courseInfo: null,
      amountLeft: "",
      formValues: {}
    };
  }
  componentDidMount() {
    const cart_id = this.props.cart_id;
    const userid = this.props.oneauthid;
    const amountLeft = this.props.amountLeft;
    console.log(cart_id, "CART");
    console.log(userid, "USERID");
    this.setState({
      cart_id,
      userid,
      amountLeft
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
          amountLeft={this.state.amountLeft}
        />
      </div>
    );
  }
}

export default continuePayment;
