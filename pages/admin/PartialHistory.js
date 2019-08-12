import PartialPayments from "../../components/PartialPayments";
import React from "react";
import Head from "../../components/head";
import Layout from "../../components/layout";
import moment from "moment";
import controller from "../../controllers/purchases";
import userController from "../../controllers/users";

class PartialHistory extends React.Component {
  static async getInitialProps({ query }) {
    console.log(query, "dsjhdjhs");
    return { userid: query.userId, cart_id: query.cart_id };
  }

  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      courseInfo: null
    };
  }

  componentDidMount() {
    const userid = this.props.userid;
    const cart_id = this.props.cart_id;
    this.setState({
      userid,
      cart_id
    });
    controller
      .handleGetPartialPurchases(userid, cart_id)
      .then(res => {
        userController.handleGetUserById(userid).then(res2 => {
          console.log(res.data, "ppppp");
          this.setState({
            firstname: res2.data.firstname,
            lastname: res2.data.lastname,
            courseInfo: res.data.PartialPayments,
            mrp: res.data.amount,
            name: res.data.product.name
          });
        });
      })
      .catch(err => {
        this.setState({
          courseInfo: null
        });
      });
  }

  render() {
    const partial = () => {
      if (this.state.courseInfo !== null) {
        return this.state.courseInfo.map(PartialPayment => {
          console.log(PartialPayment, "pp");
          const date = moment(PartialPayment.created_at).format(
            "MMMM Do YYYY,h:mm:ss a"
          );
          const mode = PartialPayment.transactions[0].payment_type;
          const center = PartialPayment.transactions[0][mode].center.name;
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
              txn_id={PartialPayment.transactions[0].id}
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
          <div>
            <h3 className="mb-2">Payment Details</h3>
            <div className="font-sm no-gutters">
              <div>
                <strong>{this.state.name}</strong>
              </div>
              <strong>Order Total: </strong> ₹ {this.state.mrp / 100}
              <div>
                <strong>Purchased By:</strong> {this.state.firstname}{" "}
                {this.state.lastname}
              </div>
            </div>
          </div>
          <div className="item-heading row">{partial()}</div>
        </div>
      </div>
    );
  }
}

export default PartialHistory;
