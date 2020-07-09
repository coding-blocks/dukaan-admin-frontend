import React from 'react';
import { withRouter } from 'next/router';
import BulkCouponForm from "../../../forms/BulkCoupon";
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import * as controllerV1 from '../../../controllers/coupons';
import * as controllerV2 from '../../../controllers/v2/couponsV2'
import Swal from 'sweetalert2';
import CheckLogin from "../../../components/CheckLogin";
import ErrorHandler from "../../../helpers/ErrorHandler";
import ProductApplicabilityInfo from "../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../components/ProductsChooser/ProductsChooserModal";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import "../../../styles/pages/admin/coupons2.scss";


class AddBulkCoupon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            organizations: [],
            // categories: [],
            subCategories: [],
            subCategoryRules: [],
            couponProducts: {},
            isModalOpen: false,
            modalProductTypeId: '',
            modalOrganizationId: '',
            isEditMode: false,
            isConfirmationModalOpen: false,
        };
    }

    componentDidMount() {
        controllerV2.fetchAddCouponData().then(([categories, organizations]) => {
            this.setState({
                // categories: categories.data,
                organizations: organizations.data,
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
        controllerV2.fetchBulkSubCategories(data).then((subCategories) => {
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
        controllerV2.fetchSubCategoryRules(data).then((subCategoryRules) => {
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
        const currentProductsForProductTypeId = {}
        currentProductsForProductTypeId[productTypeId] = products
        this.setState({
            couponProducts: {
                ...this.state.couponProducts,
                ...currentProductsForProductTypeId
            }
        })
    }

    onUnsavedChanges = () => {
        this.setState({isConfirmationModalOpen: true})
    }

    onAgree = () => {
        this.setState({
            isConfirmationModalOpen: false,
            couponProducts: {}
        })
    }

    onDisagree = () => {
        this.setState({isConfirmationModalOpen: false})
    }

    render() {
        if (!this.state.organizations) {
            return <div>Loading...</div>
        }
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Add Coupon"/>
                <Layout/>
                <CheckLogin>
                    <div className={"col-md-12"}>
                        {/* Title */}
                        <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                            <h2 className={"title"}>Add Bulk Coupons</h2>
                        </div>

                        <div className={"col-md-6 pull-left"}>
                            <BulkCouponForm data={this.state}
                                        onUnsavedChanges={this.onUnsavedChanges}
                                        onOrganizationChange={this.onOrganizationChange}
                                        handleCategoryChange={this.handleCategoryChange}
                                        handleSubCategoryChange={this.handleSubCategoryChange}/>
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
                                        currentCouponProducts={
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

                        <ConfirmationDialog isOpen={this.state.isConfirmationModalOpen} onAgree={this.onAgree}
                                            onDisagree={this.onDisagree}/>

                    </div>
                </CheckLogin>
            </div>
        )
    }

}

export default withRouter(AddBulkCoupon);