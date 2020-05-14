import React from 'react'
import Router, {withRouter} from 'next/router';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import CheckLogin from "../../../components/CheckLogin";
import AddCouponForm from "../../../forms/CouponAdd";
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../components/ProductsChooser/ProductsChooserModal";
import CouponFilterForm from "../../../components/CouponsView/CouponFilterForm";
import CouponsTable from "../../../components/CouponsView/CouponsTable";
import FieldWithElement from "../../../components/FieldWithElement";
import ProductsChooser from "../../../components/ProductsChooser";
import Formatter from "../../../helpers/formatter";
import Pagination from "../../../components/Pagination";
import Loader from "../../../components/loader";

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

                    <div className={"d-flex align-items-center mr-5 pr-5 mt-5"}>
                        <div className={"d-flex col-4"}>
                            <CouponFilterForm
                                onFiltersSet={this.onFiltersSet}
                            />
                        </div>


                        <div className={"d-flex col-md-8"}>
                            <CouponsTable
                                filterParams={this.state.filterParams}/>
                        </div>

                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(CouponsSearch)
