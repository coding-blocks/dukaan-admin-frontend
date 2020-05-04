import React from "react";
import PropTypes from 'prop-types';
import SearchInput from "./SearchInput";
import productsController from '../../controllers/products'
import {getProductTypeById} from '../../controllers/productTypes'
import ErrorHandler from "../../helpers/ErrorHandler";


class ProductsChooserV2 extends React.Component {

    constructor() {
        super();
        this.state = {
            productType: null
        }
    }


    componentDidMount() {
        getProductTypeById(this.props.productTypeId).then((response) => {
            this.setState({
                productType: response.data
            })
        }).catch((err) => {
            ErrorHandler.handle(err)
        })
    }


    onSearchInputChange = (event) => {
        productsController.searchProducts({
            organization_id: this.props.organizationId,
            product_type_id: this.props.productTypeId,
            name: event.target.value
        }).then((results) => {
            console.log(results)
        }).catch((err) => {
            console.log(err)
        })
    }

    render() {
        if (!this.state.productType) {
            return (<div>Loading ...</div>)
        }
        return (
            <div>
                <div className={"d-flex mt-1 pt-3 pb-1"}>
                    <div className={"col mb-5"}>
                        <h2>Add {this.state.productType.name} Products</h2>
                        <SearchInput onChange={this.onSearchInputChange}/>
                    </div>
                </div>
            </div>
        );
    }


}

ProductsChooserV2.propTypes = {
    productTypeId: PropTypes.number,
    organizationId: PropTypes.number
}

export default ProductsChooserV2
