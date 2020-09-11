import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import * as controller from '../../controllers/buyLink'
import * as couponController from '../../controllers/v2/couponsV2'
import * as productsController from '../../controllers/products'
import * as userController from '../../controllers/users'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Swal from "sweetalert2";
import ErrorHandler from "../../helpers/ErrorHandler";


class BuyLinkFilterForm extends React.Component {

    constructor(props) {
        super()
        this.state = {
            productSearchInput: '',
            userSearchInput: '',
            productSearchResults: [],
            userSearchResults: [],
            selectUserOpen: false,
            selectProductOpen: false,
            organizations: [],
            addressStates: [],
            filterParams: {
                active: true,
                use_credits: false,
            }
        }
    }

    componentDidMount = () => {
        controller.getFilterFormData().then(([organizations, states]) => {
            this.setState({
                organizations: organizations.data,
                addressStates: states.data
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


    onAutoCompleteOpen = (param) => {
        if (param === 'user') 
            this.setState({selectUserOpen: true})

        if (param === 'product')
            this.setState({selectProductOpen: true})
    }

    onAutoCompleteClose = (param) => {
        if (param === 'user')
             this.setState({selectUserOpen: false})

        if (param === 'product')
             this.setState({selectProductOpen: false})
    }

    onUserSearchInputChange = (event) => {
        this.setState({
            userSearchInput: event.target.value
        }, () => {
            this.handleUserSearch()
        })
    }

    handleUserSearch = () => {
        if (this.state.userSearchInput.length > 3) {
            userController.handleGetUserByEmailOrPhone('email', this.state.userSearchInput)
            .then((response) => {
                this.setState({
                    userSearchResults: response.data
                })
            }).catch((error => {
                this.setState({
                    userSearchResults: []
                })
                ErrorHandler.handle(error)
            }))
        }
    }

     onProductSearchInputChange = (event) => {
        this.setState({
            productSearchInput: event.target.value
        }, () => {
            this.handleProductSearch()
        })
    }

    handleProductSearch =  () => {
        if (this.state.productSearchInput.length > 3) {
            productsController.searchProducts({
                organization_id: this.state.filterParams.organization_id,
                description: this.state.productSearchInput
            }).then((response) => {
                this.setState({
                    productSearchResults: response.data,
                })
            }).catch((err) => {
                this.setState({
                    productSearchResults: []
                })
                ErrorHandler.handle(err)
            })
        }
    }

    handleProductChange = async (event, value) => {
        let newFilterParams = this.state.filterParams;
        newFilterParams['product_id'] = value ? value.id : ''
        this.setState(prevState => ({
          filterParams: newFilterParams
        }));
    }

    handleUserChange = async (event, value) => {
        let newFilterParams = this.state.filterParams;
        newFilterParams['user_id'] = value ? value.id : ''
        this.setState(prevState => ({
          filterParams: newFilterParams
        }));
    }

    onFormInputChange = (event) => {

        let newFilterParams = this.state.filterParams;
        newFilterParams[event.target.name] = (event.target.name === 'use_credits' ? !JSON.parse(event.target.value) : event.target.value)
        this.setState(prevState => ({
          filterParams: newFilterParams
        }));
    }

    onSearchBtnClick = () => {
        this.props.onSearchBtnClick(this.state.filterParams)
    }

    render() {
        
        return (

            <div className={"d-flex col-md-11 offset-1 mt-5"}>

                <div className={"border-card coupon-card"}>
                    
                    <div className={"d-flex justify-content-center mt-1 mb-3 pb-3"}>
                        <h2 className={"title"}>
                            Search links
                        </h2>
                    </div>

                    <div>
                        <form noValidate autoComplete="off">

                            <FormControl variant="outlined" size={"medium"}
                                fullWidth={true} className={"mb-4"}>

                                <Autocomplete
                                    autoComplete={true}
                                    fullWidth={true}
                                    open={this.state.selectUserOpen}
                                    onOpen={() => { this.onAutoCompleteOpen('user') }}
                                    onClose={() => { this.onAutoCompleteClose('user') }}
                                    loading={this.state.selectUserOpen && !this.state.userSearchResults.length}
                                    value={this.state.filterParams.user}
                                    onChange={this.handleUserChange}
                                    getOptionLabel={(option) => {
                                        return option.email
                                    }}
                                    getOptionSelected={(option, value) => {
                                        return option.id === value.id
                                    }}
                                    options={this.state.userSearchResults}
                                    renderOption={(option, {selected}) => (
                                        <React.Fragment>
                                            <Checkbox
                                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                                style={{marginRight: 8}}
                                                checked={selected}
                                            />
                                            {option.email}
                                        </React.Fragment>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="user"
                                            label="User"
                                            onChange={this.onUserSearchInputChange}
                                            variant="outlined"
                                            placeholder="Start typing to see suggestions..."
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                  <React.Fragment>
                                                    {(this.state.selectUserOpen && !this.state.userSearchResults.length) ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                  </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}

                                />

                            </FormControl>

                            <FormControl variant="outlined" size={"medium"}
                                fullWidth={true} className={"mb-4"}>
                                <InputLabel id="organization">Organization</InputLabel>

                                <Select
                                    value={this.state.filterParams.organization_id}
                                    name={"organization_id"}
                                    onChange={this.onFormInputChange}
                                    label="Organization">
                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    {
                                        this.state.organizations.map((organization) => {
                                            return (
                                                <MenuItem
                                                    key={organization.id}
                                                    value={organization.id}>{
                                                    organization.name
                                                }</MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            </FormControl>



                            <FormControl variant="outlined" size={"medium"}
                                fullWidth={true} className={"mb-4"}>

                                <Autocomplete
                                    autoComplete={true}
                                    fullWidth={true}
                                    open={this.state.selectProductOpen}
                                    onOpen={() => { this.onAutoCompleteOpen('product') }}
                                    onClose={() => { this.onAutoCompleteClose('product') }}
                                    loading={this.state.selectProductOpen && !this.state.productSearchResults.length}
                                    onChange={this.handleProductChange}
                                    value={this.state.filterParams.product}
                                    getOptionLabel={(option) => {
                                        return option.description
                                    }}
                                    getOptionSelected={(option, value) => {
                                        return option.id === value.id
                                    }}
                                    options={this.state.productSearchResults}
                                    disabled={ this.state.filterParams.organization_id ? false : true }
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
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="product"
                                            label="Product"
                                            onChange={this.onProductSearchInputChange}
                                            variant="outlined"
                                            placeholder="Start typing to see suggestions..."
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                  <React.Fragment>
                                                    {(this.state.selectProductOpen && !this.state.productSearchResults.length) ? <CircularProgress color="inherit" size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                  </React.Fragment>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                            </FormControl>

                            <TextField
                                className={"mb-4"} id="outlined-basic" label="Coupon Code" type={"string"}
                                fullWidth={true} name={"coupon_code"} value={this.state.filterParams.coupon_code}
                                onChange={this.onFormInputChange} variant="outlined"/>


                            <FormControl variant="outlined" size={"medium"}
                                fullWidth={true} className={"mb-4"}>
                                <InputLabel id="state">State</InputLabel>

                                <Select
                                    value={this.state.filterParams.state}
                                    name={"state_id"}
                                    onChange={this.onFormInputChange}
                                    label="State">

                                    <MenuItem value="">
                                        <em>Select</em>
                                    </MenuItem>
                                    {
                                        this.state.addressStates.map((state) => {
                                            return (
                                                <MenuItem
                                                    key={state.id}
                                                    value={state.id}>{
                                                    state.name
                                                }</MenuItem>
                                            )
                                        })
                                    }

                                </Select>
                            </FormControl>

                            <FormControlLabel
                                className={"mb-4"}
                                control={
                                    <Switch checked={this.state.filterParams.use_credits}
                                            onChange={this.onFormInputChange}
                                            value={this.state.filterParams.use_credits}
                                            name="use_credits"
                                    />}
                                label="Credits Applicable?"
                            />

                            <Grid container justify="center">
                                <Button
                                    id="search" size="medium" variant="outlined" className="btn-solid"
                                    style={{background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" , color: 'white', border: 0,
                                        borderRadius: 3, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}} onClick={this.onSearchBtnClick}>
                                    Search
                                </Button>
                            </Grid>

                        </form>
                    </div>

                </div>
            </div>

        )
    }
}


export default BuyLinkFilterForm
