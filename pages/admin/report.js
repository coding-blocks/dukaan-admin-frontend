import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/layout";
import purchasesController from "../../controllers/purchases.js";
import Loader from '../../components/loader';
import FinanceReport from "../../components/FinanceReport";
import CheckLogin from "../../components/CheckLogin";

class Report extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
            <Head title="Coding Blocks | Dukaan | Payments | Report" />
            <Layout/>
            <FinanceReport></FinanceReport>
            </div>
        );
    }
}

export default Report;
