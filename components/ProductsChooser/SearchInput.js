import React from 'react'
import productsController from "../../controllers/products";
import ErrorHandler from "../../helpers/ErrorHandler";
import {Autocomplete} from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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
                    fullWidth={true}
                    onChange={this.handleChange}
                    getOptionLabel={(option) => option.name}
                    id="tags-standard"
                    disableCloseOnSelect
                    value={this.state.selectedProducts}
                    filterSelectedOptions={true}
                    getOptionSelected={(option, value) => {
                        return option.name === value.name
                    }}
                    options={this.state.productSearchResults}
                    renderOption={(option, {selected}) => (
                        <React.Fragment>
                            <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                style={{marginRight: 8}}
                                checked={selected}
                            />
                            {option.name}
                        </React.Fragment>
                    )}
                    style={{width: 800}}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={this.onSearchInputChange}
                            variant="outlined"
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




