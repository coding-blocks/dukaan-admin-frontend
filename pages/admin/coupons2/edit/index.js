import {axios} from "../../../../DukaanAPI";
import React from 'react'
import {withRouter} from 'next/router';
import Loader from '../../../../components/loader';
import Head from '../../../../components/head';
import Layout from "../../../../components/layout";
import CouponForm from "../../../../forms/Coupon";
import CheckLogin from "../../../../components/CheckLogin";
import * as controller from '../../../../controllers/v2/couponsV2'
import ErrorHandler from "../../../../helpers/ErrorHandler";
import "../../../../styles/pages/admin/coupons2.scss";
import Swal from 'sweetalert2';
import ProductApplicabilityInfo from "../../../../components/ProductApplicabilityInfo";
import ProductsChooserModal from "../../../../components/ProductsChooser/ProductsChooserModal";

class EditCoupons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            organizations: [],
            sub_category_id: null,
            categories: [],
            subCategories: [],
            subCategoryRules: [],
            coupon: {},

            isModalOpen: false,
            modalProductTypeId: '',
            modalOrganizationId: '',
            couponProducts: {},
            couponUsers: [],
            isEditMode: true
        }
    }

    fillcouponProducts = (couponProducts) => {
        const products = couponProducts.map(p => p.product)
        const groupBy = (array, key) => {
            return array.reduce((result, currentValue) => {
                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                    currentValue
                );
                return result;
            }, {});
        };
        const productsGroupedByType = groupBy(products, 'product_type_id');
        this.setState({
            couponProducts: productsGroupedByType
        })
    }

    componentDidMount() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const couponId = params.get('couponId');
        if (!couponId) {
            window.location.href = '/'
        }
        controller.getCoupon(couponId).then((response) => {
            this.setState({
                coupon: response.data
            })
            return controller.fetchEditCouponData(response.data)
        }).then(([subCategoryId, categories, subCategoryRules, subCategories, organizations, couponProducts, couponUsers]) => {
            this.setState({
                sub_category_id: subCategoryId.data,
                categories: categories.data,
                subCategoryRules: subCategoryRules.data,
                subCategories: subCategories.data,
                organizations: organizations.data,
                modalOrganizationId: organizations.data[0].id,
                couponUsers: couponUsers.data.map(u => u.user),
                loaded: true
            })
            this.fillcouponProducts(couponProducts.data)
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
                            <CouponForm data={this.state} handleSubCategoryChange={this.handleSubCategoryChange}/>
                        </div>
                        }
                        <div className={"col-md-6 pull-right"}>
                            {/* Product applicability pane */}
                            {this.state.subCategoryRules.length > 0 &&
                            <ProductApplicabilityInfo productDetails={this.state.subCategoryRules}
                                                      couponProducts={this.state.couponProducts}
                                                      handleModifyProducts={this.handleOpenModal}
                            />
                            }
                        </div>

                        {this.state.loaded &&
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

export default withRouter(EditCoupons)
