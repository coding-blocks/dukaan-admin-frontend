import React from 'react';
import ReactDOM from 'react-dom';
import Head from "../../../components/head";
import Layout from "../../../components/layout";

class AuthorizedPayments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            payments: undefined
        }

    }


    componentDidMount() {
    }

    render() {
        if (!this.state.payments) {
            return (<div>
                <Head title={"Loading..."}>
                    <Layout>
                        <div className={"d-flex col-8 mt-4 ml-3"}>
                            <h1>Loading...</h1>
                        </div>
                    </Layout>
                </Head>
            </div>)
        }
        return (<div>Payment</div>)
    }

}

export default AuthorizedPayments
