import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import ContinuePayment from "../../components/ContinuePayment";

class continuePayment extends React.Component {
  static async getInitialProps({ query }) {
    return {
      oneauthId: query.oneauthId,
      cart_id: query.cartId,
      amountLeft: query.amountLeft,
      id: query.userId,
      minBase: query.minBase
    };
  }
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     id: "",
  //     cart_id: "",
  //     userid: "",
  //     courseInfo: null,
  //     amountLeft: "",
  //     formValues: {}
  //   };
  // }
  // componentDidMount() {
  //   this.setState({
  //       ...this.props
  //   });
  // }

  render() {
    return (
      <div>
        <Head />
        <Layout />
        <div className={"d-flex justify-content-center mt-5"}>
          <ContinuePayment
            id={this.props.id}
            oneauthId={this.props.oneauthId}
            cart_id={this.props.cart_id}
            amountLeft={this.props.amountLeft}
            minBase={this.props.minBase}
          />
        </div>
      </div>
    );
  }
}

export default continuePayment;
