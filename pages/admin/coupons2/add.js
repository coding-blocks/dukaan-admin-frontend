import React from 'react'
import {withRouter} from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import CouponForm from "../../../forms/Coupon";
import CheckLogin from "../../../components/CheckLogin";
import * as controller from '../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../helpers/ErrorHandler";
import "../../../styles/pages/admin/coupons2.scss";
import Swal from 'sweetalert2';
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../components/ProductsChooser/ProductsChooserModal";


class AddCoupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            organizations: [],
            categories: [],
            subCategories: [],
            subCategoryRules: [],
            isModalOpen: false,
            modalProductTypeId: '',
            modalOrganizationId: '',
            couponProducts: {},
            couponUsers:[],
            isEditMode:false,
        }
    }


    componentDidMount() {
        // This should only contain single function that
        // should fetch every data required for this component.
        controller.fetchAddCouponData().then(([categories, organizations]) => {
            this.setState({
                organizations: organizations.data,
                categories: categories.data,
                modalOrganizationId: organizations.data[0].id
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

    onOrganizationChange = (event) => {
        this.setState({
            modalOrganizationId: event.target.value
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
        this.setState({
            subCategoryRules: []
        })
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

    handleOpenModal = (productTypeId) => {
        this.setState({
            isModalOpen: true,
            modalProductTypeId: productTypeId
        })
    }

    handleCloseModal = () => {
        this.setState({
            isModalOpen: false
        })
    }


    onProductsSelected = (productTypeId, products) => {
        const newCouponProducts = this.state.couponProducts
        newCouponProducts[productTypeId] = products
        this.setState({
            couponProducts: newCouponProducts
        })
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
                            <CouponForm data={this.state}
                                           handleCategoryChange={this.handleCategoryChange}
                                           onOrganizationChange={this.onOrganizationChange}
                                           handleSubCategoryChange={this.handleSubCategoryChange}
                                           resetSubCategoryRules={this.resetSubCategoryRules}
                                           />
                        </div>
                        <div className={"col-md-6 pull-right"}>
                            {/* Product applicability pane */}
                            {this.state.subCategoryRules.length > 0 &&
                            <ProductApplicabilityInfo productDetails={this.state.subCategoryRules}
                                                      couponProducts={this.state.couponProducts}
                                                      handleModifyProducts={this.handleOpenModal}
                            />
                            }
                        </div>


                        {
                            this.state.modalProductTypeId &&
                            this.state.modalOrganizationId ?
                                <div>
                                    <ProductsChooserModal
                                        preFilledProducts={
                                            this.state.couponProducts[this.state.modalProductTypeId]
                                        }
                                        isModalOpen={this.state.isModalOpen}
                                        handleCloseModal={this.handleCloseModal}
                                        onProductsSelected={this.onProductsSelected}
                                        organizationId={this.state.modalOrganizationId}
                                        productTypeId={this.state.modalProductTypeId}/>
                                </div>
                                :
                                <div/>
                        }

                    </div>
                </CheckLogin>
            </div>
        )
    }
}

export default withRouter(AddCoupons)
