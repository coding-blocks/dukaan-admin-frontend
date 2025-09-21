import React from 'react'
import productsController from "../../controllers/products";
import ErrorHandler from "../../helpers/ErrorHandler";
import {Autocomplete} from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Chip from '@material-ui/core/Chip';


class SearchInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            productSearchResults: [],
            selectedProducts: props.currentCouponProducts ? props.currentCouponProducts : []
        }

    }

    onSearchInputChange = (event) => {
        this.setState({
            searchInput: event.target.value
        }, () => {
            this.handleSearch()
        })

    }

    handleSearch = () => {
        productsController.searchProducts({
            organization_id: this.props.organizationId,
            product_type_id: this.props.productTypeId,
            description: this.state.searchInput
        }).then((response) => {
            this.setState({
                productSearchResults: response.data
            })
        }).catch((err) => {
            this.setState({
                productSearchResults: []
            })
            ErrorHandler.handle(err)
        })
    }


    handleChange = (event, values) => {
        this.setState({
            selectedProducts: (this.props.isEverUsed || this.props.isSubCategoryBulk) ? 
                              [...this.props.preFilledProducts, ...values.filter((option) => this.props.preFilledProducts.indexOf(option) === -1 ) ] : 
                              values,
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
                    value={this.state.selectedProducts}
                    getOptionLabel={(option) => {
                        return option.description
                    }}
                    id="tags-standard"
                    disableCloseOnSelect
                    filterSelectedOptions
                    getOptionSelected={(option, value) => {
                        return option.id === value.id
                    }}
                    options={this.state.productSearchResults}
                    disabled={ this.props.isSubCategoryBulk }
                    renderOption={(option, {selected}) => (
                        <React.Fragment>
                            <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                style={{marginRight: 8}}
                                checked={selected}
                            />
                            {option.description}
                        </React.Fragment>
                    )}
                    renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option.description}
                            {...getTagProps({ index })}
                            disabled={ (this.props.isEverUsed || this.props.isSubCategoryBulk) ? this.props.preFilledProducts.indexOf(option) !== -1 : ''}
                        />
                        ))
                    }
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
    productTypeId: PropTypes.number.isRequired,
    organizationId: PropTypes.number.isRequired,
    isEverUsed: PropTypes.bool.isRequired,
    isSubCategoryBulk: PropTypes.bool
}

export default SearchInput;




