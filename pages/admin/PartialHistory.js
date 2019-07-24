import PartialPayments from "../../components/PartialPayments";
import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import axios from "axios";
import moment from "moment";

class PartialHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: null,
      courseInfo: null
    };
  }

  componentDidMount() {
    const userid = window.location
      .toString()
      .split("=")[1]
      .substring(0, 1);
    const cart_id = window.location.toString().split("=")[2];
    console.log(cart_id, "CART");
    console.log(userid, "USERID");
    this.setState({
      cart_id: cart_id,
      userid
    });

    axios
      .get(
        `http://localhost:2929/api/v2/admin/purchases/partial?userId=${userid}&cartId=${cart_id}`,
        {
          withCredentials: true
        }
      )
      .then(res => {
        console.log(res.data.PartialPayments);
        this.setState({
          courseInfo: res.data.PartialPayments,
          mrp: res.data.product.mrp,
          name: res.data.product.name
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          courseInfo: null
        });
      });
  }
  render() {
    const partial = () => {
      if (this.state.courseInfo !== null) {
        return this.state.courseInfo.map(PartialPayment => {
          const date = moment(PartialPayment.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          const mode = PartialPayment.transaction.payment_type;
          const center = PartialPayment.transaction[mode].center.name;
          return (
            <PartialPayments
              date={date}
              Productname={this.state.name}
              userid={this.state.userid}
              fee={PartialPayment.fee / 100}
              tax_collected={PartialPayment.tax_collected / 100}
              status={PartialPayment.status}
              partial_amount={PartialPayment.partial_amount / 100}
              partial_invoice_link={PartialPayment.partial_invoice_link}
              id={PartialPayment.id}
              name={`${PartialPayment.user.firstname}  ${
                PartialPayment.user.lastname
              }`}
              mode={mode}
              mrp={this.state.mrp / 100}
              center={center}
              txn_id={PartialPayment.transaction.id}
            />
          );
        });
      }
    };
    return (
      <div>
        <Head />
        <Layout />
        <div className="container">
          <div className="item-heading row">{partial()}</div>
        </div>
      </div>
    );
  }
}

export default PartialHistory;
