import React from 'react'
import productsController from "../../controllers/products";
import ErrorHandler from "../../helpers/ErrorHandler";
import {Autocomplete} from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";

class SearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            productSearchResults: [],
            selectedProducts: []
        }

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

            }).catch((err) => {
                ErrorHandler.handle(err)
            })
        }

    }


    handleChange = (event, values) => {
        this.setState({
            selectedProducts: values
        }, () => {
            this.props.onProductsSelected(this.state.selectedProducts)
        });
    }

    render() {
        return (
            <div>
                <Autocomplete
                    multiple
                    autoComplete={true}
                    fullWidth={false}
                    onChange={this.handleChange}
                    getOptionLabel={(option) => option.name}
                    id="tags-standard"
                    options={this.state.productSearchResults}

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={this.onSearchInputChange}
                            variant="standard"
                            label="Products"
                            placeholder="Start typing to see suggestions..."
                        />
                    )}
                />
            </div>
        )
    }
}

SearchInput.propType = {
    productTypeId: PropTypes.number,
    organizationId: PropTypes.number
}

export default SearchInput;




