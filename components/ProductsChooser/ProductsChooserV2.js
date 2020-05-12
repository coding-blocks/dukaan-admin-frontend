import React from "react";
import PropTypes from 'prop-types';
import SearchInput from "./SearchInput";
import {getProductTypeById} from '../../controllers/productTypes'
import ErrorHandler from "../../helpers/ErrorHandler";
import Button from "@material-ui/core/Button";


class ProductsChooserV2 extends React.Component {

    constructor(props) {
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

    onSaveChangeClicked = () => {
        this.props.onProductsSelected(this.props.productTypeId, this.state.selectedProducts)
    }


    render() {
        //TODO Handle network failure at componentDidMount
        if (!this.state.productType) {
            return (<div>Loading ...</div>)
        }
        return (
            <div>
                <div className={"col-md-5 mb-3"}>

                    <h6 className="mb-3 title">Search {this.state.productType.name} Products</h6>
                    <SearchInput
                        preFilledProducts={this.props.preFilledProducts}
                        organizationId={this.props.organizationId}
                        onProductsSelected={this.onProductsSelected}
                        productTypeId={this.props.productTypeId}/>
                    <div className={"mt-5"}>
                        <Button variant="outlined" color="primary"
                                onClick={this.onSaveChangeClicked}
                        >
                            Save Changes
                        </Button>
                    </div>

                </div>
            </div>
        );
    }

}

ProductsChooserV2.propTypes = {
    productTypeId: PropTypes.number.isRequired,
    organizationId: PropTypes.number.isRequired,
    onProductsSelected: PropTypes.func
}

export default ProductsChooserV2
