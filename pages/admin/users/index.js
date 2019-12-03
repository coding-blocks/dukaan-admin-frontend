/**
 * Created by tdevm on 17/10/19.
 */

import React from 'react';
import ReactDOM from 'react-dom'
import userController from "../../../controllers/users";
import ErrorHandler from "../../../helpers/ErrorHandler";
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import SingleUserDetail from "../../../components/SingleUserDetail";
import Link from "next/link";
import PrimaryAddress from "../../../components/partialComponents/PrimaryAddressComponent";
import {filterPrimaryAddress} from "../../../helpers/filterPrimaryAddress"

class User extends React.Component {
    constructor() {
        super();
        this.state = {}

    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const oneauthId = params.get('oneauthId');
        if (!oneauthId) {
            window.location.href = '/'
        }
        userController.getUserByFromOneAuthByOneAuthId(oneauthId).then((response) => {
            this.setState({
                user: response.data,
                primaryAddress: response.data.demographic.addresses ? filterPrimaryAddress(response.data.demographic.addresses) : {}
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    render() {
        if (!this.state.user) {
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
        return (
            <div>
                <Head title={"User Details | Dukaan"}/>

                <Layout>
                    <div className="border-card br-20 bg-light-grey mb-5">
                        <div className={"row"}>
                            <div>
                                <h5>User Details</h5>
                            </div>

                            <div className={"ml-4"}>
                                <Link href={`/admin/users/edit?oneauthId=${this.state.user.id}`}>
                                    <button className={"button-solid"}>
                                        Edit Details
                                    </button>
                                </Link>
                            </div>

                        </div>
                        <div
                            style={{
                                alignItems: "center"
                            }}>
                            <p className="red">Username : {this.state.user.username}</p>
                            <p>
                                Name : {this.state.user.firstname} {this.state.user.lastname}
                            </p>
                            <p>Email : {this.state.user.email}</p>
                            <p>Mobile : {this.state.user.mobile_number}</p>
                            <p>Graduation Year : {this.state.user.graduationYear}</p>
                            {this.state.primaryAddress ? <PrimaryAddress primaryAddress={this.state.primaryAddress}
                                                                         college={this.state.user.demographic ? this.state.user.demographic.college : {}}
                                                                         branch={this.state.user.demographic ? this.state.user.demographic.branch : {}}/> :
                                <div></div>}

                        </div>
                    </div>
                </Layout>
            </div>
        )
    }
}


export default User;
