import React from "react";
import PropTypes from 'prop-types';
import SearchInput from "./SearchInput";
import {getProductTypeById} from '../../controllers/productTypes'
import ErrorHandler from "../../helpers/ErrorHandler";
import Button from "@material-ui/core/Button";


class ProductsChooserV2 extends React.Component {

    constructor() {
        super();
        this.state = {
            productType: null,
            selectedProducts: []
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


    onProductsSelected = (selectedProducts) => {
        this.setState({
            selectedProducts
        })
    }


    render() {
        //TODO Handle network failure at componentDidMount
        if (!this.state.productType) {
            return (<div>Loading ...</div>)
        }
        return (
            <div>
                <div className={"col-md-5 mt-5 mb-5"}>

                        <div className={"col mb-5"}>
                            <p>Search {this.state.productType.name} Products</p>
                            <SearchInput
                                organizationId={this.props.organizationId}
                                onProductsSelected={this.onProductsSelected}
                                productTypeId={this.props.productTypeId}/>
                        </div>
                        <div>
                            <Button variant="outlined" color="primary">
                                Save Changes
                            </Button>
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
