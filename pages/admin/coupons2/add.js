import React from 'react'
import {withRouter} from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import AddCouponForm from "../../../forms/CouponAdd";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../helpers/ErrorHandler";
import "../../../styles/pages/admin/coupons2.scss";


class AddCoupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organizations: [],
            categories: [],
            subCategories: [],
            subCategoryRules: []
        }
    }

  
   componentDidMount() {
        // This should only contain single function that
        // should fetch every data required for this component.
        controller.fetchAddCouponData().then(([categories,organizations]) => {
            this.setState({
                organizations: organizations.data,
                categories: categories.data
            })
        }).catch(error => {
            ErrorHandler.handle(error)
            Swal.fire({
                type: "error",
                title: "Error fetching resources!",
                text: error
            });
        });
    }

    fillSubCategories = (data) => {
        controller.fetchSubCategories(data).then((subCategories) => {
           this.setState({
               subCategories: subCategories.data
           })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    };

    handleCategoryChange = (event) => {
        this.fillSubCategories({category: event.target.value})
        return event.target.value
    }

    fillSubCategoryRules = (data) => {
        controller.fetchSubCategoryRules(data).then((subCategoryRules) => {
           this.setState({
               subCategoryRules: subCategoryRules.data
           })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    handleSubCategoryChange = (event, category) => {
        this.fillSubCategoryRules({id: 1, category: category})
        return event.target.value
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Add Coupon"/>
                <Layout/>
                <CheckLogin>
                <div className={"col-md-12"}>
                    {/* Title */}
                    <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                        <h2 className={"title"}>Add Coupon</h2>
                    </div>
                    <div className={"col-md-6 pull-left"}>
                        <AddCouponForm data={this.state} handleCategoryChange={this.handleCategoryChange}
                                       handleSubCategoryChange={this.handleSubCategoryChange}/>
                    </div>
                    <div className={"col-md-6 pull-right"}>

                    </div>
                </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(AddCoupons)
