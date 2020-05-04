import React from 'react'
import productsController from "../../controllers/products";
import ErrorHandler from "../../helpers/ErrorHandler";

class SearchInput extends React.Component {

    constructor(props) {
        super(props);

    }

    onSearchInputChange = (event) => {
        if (event.target.value.length > 3) {
            productsController.searchProducts({
                organization_id: this.props.organizationId,
                product_type_id: this.props.productTypeId,
                name: event.target.value
            }).then((response) => {
                this.setState({
                    productSearchResults: response.data
                })
                this.props.onSearchResult(this.state.productSearchResults)
            }).catch((err) => {
                ErrorHandler.handle(err)
            })
        }

    }


    render() {
        return (
            <div>
                <div>
                    <input type={'text'} onChange={this.onSearchInputChange}/>
                </div>
            </div>
        )
    }
}

SearchInput.propType = {

}

export default SearchInput;




