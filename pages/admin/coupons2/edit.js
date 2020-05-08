import React from 'react'
import {withRouter} from 'next/router';
import Loader from '../../../components/loader';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import EditCouponForm from "../../../forms/CouponEdit";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../helpers/ErrorHandler";
import "../../../styles/pages/admin/coupons2.scss";
import Swal from 'sweetalert2'; 
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";


class EditCoupon extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            organizations:[],
        	sub_category: null,
            subCategories: [],
            subCategoryRules: [],
            user_id: null,
            coupon_user:null,
            coupon: this.props.router.query
        }
    }

   componentDidMount() {
        controller.fetchEditCouponData(this.props.router.query).then(([subCategoryId, subCategoryRules, subCategories, organizations, couponUser]) => {
            this.setState({
            	sub_category: subCategoryId.data,
            	subCategoryRules: subCategoryRules.data,
            	subCategories: subCategories.data,
            	organizations: organizations.data,
            	user_id: couponUser.data.id,
            	coupon_user: {
            			value: couponUser.data.user.email,
			            label: `Email: ${couponUser.data.user.email} Username: ${couponUser.data.user.username}`,
			            user_id: `${couponUser.data.user.id}`
            	},
            	loaded: true
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

    fillSubCategoryRules = (data) => {
        controller.fetchSubCategoryRules(data).then((subCategoryRules) => {
            this.setState({
                subCategoryRules: subCategoryRules.data,
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    handleSubCategoryChange = (event, category) => {
        this.fillSubCategoryRules({id: event.target.value, category: category})
        return parseInt(event.target.value)
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Edit Coupon"/>
                <Layout/>
                <CheckLogin>
                <div className={"col-md-12"}>
                    {/* Title */}
                    <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                        <h2 className={"title"}>Edit Coupon</h2>
                    </div>
	                {this.state.loaded &&
	                    <div className={"col-md-6 pull-left"}>
	                   	    <EditCouponForm data={this.state} handleSubCategoryChange={this.handleSubCategoryChange}/>
	                    </div>
	                }
                    <div className={"col-md-6 pull-right"}>
                        {/* Product applicability pane */}
                        {this.state.subCategoryRules.length > 0 &&
                            <ProductApplicabilityInfo productDetails={this.state.subCategoryRules} />
                        }
                    </div>
                </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(EditCoupon)
