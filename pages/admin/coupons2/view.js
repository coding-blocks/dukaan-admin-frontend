import React from 'react'
import {withRouter} from 'next/router';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import CheckLogin from "../../../components/CheckLogin";
import AddCouponForm from "../../../forms/CouponAdd";
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../components/ProductsChooser/ProductsChooserModal";
import CouponFilterForm from "../../../components/CouponsView/CouponFilterForm";
import CouponsTable from "../../../components/CouponsView/CouponsTable";

class CouponsSearch extends React.Component {


    constructor() {
        super();
        this.state = {
            filterParams: null
        }

    }


    onFiltersSet = (filterParams) => {
        this.setState({
            filterParams
        })
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Coupon"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>

                        <div className={"col-md-6 pull-left"}>
                            {/* Coupon Filter Form */}
                            <CouponFilterForm
                                onFiltersSet={this.onFiltersSet}
                            />

                        </div>
                        <div className={"col-md-6 pull-right"}>
                            {/* Coupon Results Table */}

                            {this.state.filterParams ?

                                <CouponsTable
                                    filterParams={this.state.filterParams}/>

                                : <div/>
                            }

                        </div>
                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(CouponsSearch)
