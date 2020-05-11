import React from 'react'
import {withRouter} from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import AddCouponForm from "../../../forms/CouponAdd";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../helpers/ErrorHandler";
import "../../../styles/pages/admin/coupons2.scss";
import Swal from 'sweetalert2';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";

import ProductsChooserV2 from "../../../components/ProductsChooser/ProductsChooserV2";


class AddCoupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organizations: [],
            categories: [],
            subCategories: [],
            subCategoryRules: [],

            currentCategory: '',
            currentSubCategory: '',
            currentOrganizationId: '',

            modalOpen: false,
            modalProductTypeId: '',
            modalOrganizationId: ''
        }
    }


    componentDidMount() {
        // This should only contain single function that
        // should fetch every data required for this component.
        controller.fetchAddCouponData().then(([categories, organizations]) => {
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

    onOrganizationChange = (organizationId) => {
        this.setState({
            currentOrganizationId: organizationId
        })
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

    handleOpen = (productTypeId) => {
        this.setState({
            modalOpen: true,
            modalProductTypeId: productTypeId
        })
    }

    handleClose = () => {
        this.setState({
            modalOpen: false
        })
    }

    handleAddProduct = (productTypeId) => {
        this.handleOpen(productTypeId)
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
                            {/* Coupon Form */}
                            <AddCouponForm data={this.state}
                                           handleCategoryChange={this.handleCategoryChange}
                                           onOrganizationChange={this.onOrganizationChange}
                                           handleSubCategoryChange={this.handleSubCategoryChange}/>
                        </div>
                        <div className={"col-md-6 pull-right"}>
                            {/* Product applicability pane */}
                            {this.state.subCategoryRules.length > 0 &&
                            <ProductApplicabilityInfo productDetails={this.state.subCategoryRules}
                                                      handleModifyProducts={this.handleAddProduct}
                                                      showModal={this.handleOpen}
                            />
                            }
                        </div>

                        <div>
                            <Dialog
                                open={this.state.modalOpen}
                                onClose={this.handleClose}
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description">
                                {<ProductsChooserV2
                                    organizationId={this.state.modalOrganizationId}
                                    productTypeId={this.state.modalProductTypeId}
                                />}
                            </Dialog>
                        </div>


                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(AddCoupons)
