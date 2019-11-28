import React from 'react';
import ReactDOM from 'react-dom';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import {Formik} from "formik";
import FieldWithElement from "../../../components/FieldWithElement";

class DukaanPayments extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            payments: undefined
        }

    }


    componentDidMount() {

    }

    render() {

        return (<div>


            <div>
                <Head title="Edit User | Dukaan"/>
                <Layout>
                    <div className={"d-flex col-12 mt-4 ml-3 justify-content-center"}>

                        <div className="input-search w-75" style={{display: "inline-block"}}>
                            <input id="search-bar" type="text" placeholder="Enter razorpay payment ID"></input>
                        </div>

                        <button
                            id="search"
                            className="button-solid mb-1"
                            style={{fontSize: "1.3rem"}}>
                            Search
                        </button>
                    </div>
                    <div>

                    </div>
                </Layout>
            </div>


        </div>)
    }

}

export default DukaanPayments
