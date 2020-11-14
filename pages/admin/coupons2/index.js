import React from 'react'
import Router, {withRouter} from 'next/router';
import Head from "../../../components/head";
import Layout from "../../../components/layout";
import CheckLogin from "../../../components/CheckLogin";
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../components/ProductsChooser/ProductsChooserModal";
import CouponFilterForm from "../../../components/CouponsView/CouponFilterForm";
import CouponsTable from "../../../components/CouponsView/CouponsTable";
import FieldWithElement from "../../../components/FieldWithElement";
import ProductsChooser from "../../../components/ProductsChooser";
import Formatter from "../../../helpers/formatter";
import Pagination from "../../../components/Pagination";
import Loader from "../../../components/loader";
import "../../../styles/pages/admin/coupons2.scss";


class CouponsSearch extends React.Component {

    constructor() {
        super();
        this.couponTable = React.createRef();
        this.state = {
            filterParams: {
                active:true,
                expired:false
            }
        }
    }

    onSearchBtnClick = (filterParams) => {
        this.setState({
            filterParams
        }, async () => {
            await this.couponTable.current.resetPageInfo();
            this.couponTable.current.fillTable();
        });
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Coupon"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>
                            <div className={"col-md-3 pull-left"}>
                                <CouponFilterForm
                                    onSearchBtnClick={this.onSearchBtnClick}
                                />
                            </div>

                            <div className={"col-md-9 pull-right"}>
                                <CouponsTable
                                    filterParams={this.state.filterParams}
                                    ref={this.couponTable}/>
                            </div>

                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(CouponsSearch)
