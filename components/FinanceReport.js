import React from 'react';
import Head from "./head";
import Layout from "./layout";
import "../styles/pages/admin/products.scss";
import purchasesController from "../controllers/purchases.js";
import Loader from './loader';
import CheckLogin from "./CheckLogin";

class FinanceReport extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iframeUrl: ''
        }
    }

    componentDidMount() {
        purchasesController.getReportUrl().then((data) => {
            this.setState({iframeUrl: data.data.iframeUrl})
        })
    }
    render() {
        return (
            <div>
            <Head title="Coding Blocks | Dukaan | Payments | Report" />
            <Layout/>
            <div style={{width: "1200px" , margin: "20px auto"}}>
            <iframe
            src={this.state.iframeUrl}
            frameBorder="0"
            width="1200"
            height="600"
            allowtransparency='true'
            ></iframe>
            </div>
            </div>
        );
    }

}

export default FinanceReport;
