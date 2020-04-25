import React from 'react'
import {withRouter} from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import AddCouponForm from "../../../forms/CouponAdd";
import * as CouponsV2Controller from '../../../controllers/v2/couponsV2'

class AddCoupons extends React.Component {


    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
        // This should only contain single function that
        // should fetch every data required for this component.
        CouponsV2Controller.fetchAddCouponData().then(() => {

        })
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Add Coupon"/>
                <Layout/>
                <AddCouponForm/>
            </div>
        )
    }
}

export default withRouter(AddCoupons)
