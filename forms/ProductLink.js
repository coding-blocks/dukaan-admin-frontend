import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import * as controller from '../controllers/buyLink'
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Formik, Field} from 'formik';
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Swal from "sweetalert2";
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import * as Yup from 'yup';


const useStyles = theme => ({
    root: {
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        color: 'white',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        marginTop: '5%'
    },
});

const ProductLinkSchema = Yup.object().shape({
    user: Yup.object()
        .typeError('user is required')
        .required('user is required'),
    product: Yup.object()
        .typeError('product is required')
        .required('product is required'),
    organization_id: Yup.number()
        .nullable().notRequired(),
    center_id: Yup.number()
        .nullable().notRequired(),
    applyCredits: Yup.boolean()
        .notRequired()
});

const initialValues = {
    organization_id: '',
    center_id: '',
    product: '',
    user: '',
    applyCredits: false,
    category: '',
    coupon: '',
    state: ''
}

class ProductLinkForm extends React.Component {

    constructor(props) {
        super(props)
        this.formik = React.createRef();
    }

    generateLink = (fields) => {

        controller.handleAddBuyLink({
            user_id: fields.user.id,
            product_id: fields.product.id,
            coupon_id: fields.coupon ? fields.coupon.id : '',
            use_credits: fields.applyCredits,
            state_id: fields.state,
        }).then((response) => {
            this.props.ongenerateLink(response.data.short_url)
        }).catch((error) => {
            Swal.fire({
                title: "Error while creating link!",
                type: "error",
                text: error
            });
        });
    }

    handleCustomCouponCreation = (coupon) => {
        this.formik.current.setFieldValue("category", coupon.category)
        this.formik.current.setFieldValue("coupon", coupon)
        this.props.handleCategoryChange(coupon.category)
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={"d-flex col-md-11 offset-1 mt-5"}>
                <div className={"border-card"}>
                    <div className={"d-flex justify-content-center mt-1 mb-3 pb-3"}>
                        <h2 className={"title"}>
                            Generate Buy Link
                        </h2>
                    </div>

                    <Formik initialValues={initialValues}  validationSchema={ProductLinkSchema}
                        onSubmit={this.generateLink} ref={this.formik}>

                        {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting
                            , setFieldValue, setFieldTouched}) => (
                        
                            <form onSubmit={handleSubmit}>

                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>

                                    <Autocomplete
                                        autoComplete={true}
                                        fullWidth={true}
                                        open={this.props.selectUserOpen}
                                        onOpen={() => { this.props.onAutoCompleteOpen('user') }}
                                        onClose={() => { this.props.onAutoCompleteClose('user') }}
                                        loading={this.props.selectUserOpen && !this.props.userSearchResults.length}
                                        value={values.user}
                                        onChange={ (e, value) => {
                                            this.props.handleUserChange(e, value)
                                            setFieldValue("user", value)
                                            setFieldValue("category", '')
                                            setFieldValue("coupon", '')
                                        }}
                                        getOptionLabel={(option) => {
                                            return option.email
                                        }}
                                        getOptionSelected={(option, value) => {
                                            return option.id === value.id
                                        }}
                                        options={this.props.userSearchResults}
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
                                                onChange={this.props.onUserSearchInputChange}
                                                variant="outlined"
                                                placeholder="Start typing to see suggestions..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>
                                                        {(this.props.selectUserOpen && !this.props.userSearchResults.length) ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                      </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}

                                    />

                                    {errors.user && touched.user && <span className="red mt-2 ml-auto">
                                        {errors.user}
                                    </span>}

                                </FormControl>

                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>
                                    <InputLabel id="organization">Organization</InputLabel>

                                    <Select
                                        value={values.organization_id}
                                        name={"organization_id"}
                                        onChange={(e) => {
                                            this.props.onOrganizationChange(e)
                                            setFieldValue("organization_id", e.target.value)
                                            setFieldValue("center_id", '') 
                                            setFieldValue("product", '') 
                                        }}
                                        label="Organization">

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {
                                            this.props.organizations.map((organization) => {
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
                                    <InputLabel id="centers">Centers</InputLabel>

                                    <Select
                                        value={values.center_id}
                                        name={"center_id"}
                                        onChange={(e) => {
                                            this.props.onCenterChange(e)
                                            setFieldValue("center_id", e.target.value)
                                            setFieldValue("product", '') 
                                        }}
                                        label="center"
                                    >
                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {
                                            this.props.centers.map((center) => {
                                                return (
                                                    <MenuItem
                                                        key={center.id}
                                                        value={center.id}
                                                        >{
                                                        center.name
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
                                        open={this.props.selectProductOpen}
                                        onOpen={() => { this.props.onAutoCompleteOpen('product') }}
                                        onClose={() => { this.props.onAutoCompleteClose('product') }}
                                        loading={this.props.selectProductOpen && !this.props.productSearchResults.length}
                                        onChange={(e, value) => {
                                            this.props.handleProductChange(e, value)
                                            setFieldValue("product", value)
                                            setFieldValue("category", '')
                                            setFieldValue("coupon", '')
                                        }}
                                        value={values.product}
                                        getOptionLabel={(option) => {
                                            return option.description
                                        }}
                                        getOptionSelected={(option, value) => {
                                            return option.id === value.id
                                        }}
                                        options={this.props.productSearchResults}
                                        disabled={ (values.organization_id && values.center_id) ? false : true}
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
                                                onChange={this.props.onProductSearchInputChange}
                                                variant="outlined"
                                                placeholder="Start typing to see suggestions..."
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                      <React.Fragment>
                                                        {(this.props.selectProductOpen && !this.props.productSearchResults.length) ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                      </React.Fragment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />

                                    {errors.product && touched.product && <span class="red ml-auto mt-2">
                                        {errors.product}
                                    </span>}

                                </FormControl>


                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>
                                    <InputLabel id="category">Coupon category</InputLabel>

                                    <Select
                                        value={values.category}
                                        name={"category"}
                                        id="category"
                                        label="Coupon category"
                                        onChange={(e) => {
                                            this.props.handleCategoryChange(e.target.value)
                                            setFieldValue("category", e.target.value)
                                            setFieldValue("coupon", '')
                                        }}
                                        disabled={!this.props.product || !this.props.user}
                                        >

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        <MenuItem value="special_discount"> Special Discount </MenuItem>
                                        <MenuItem value="telecounselor"> Telecounselor </MenuItem>
                                        <MenuItem value="campaign"> Campaign </MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>

                                    <Autocomplete
                                        autoComplete={true}
                                        fullWidth={true}
                                        id="coupon"
                                        options={this.props.coupons}
                                        value={values.coupon}
                                        onChange={ (e, value) => {
                                            this.props.handleCouponChange(value)
                                            setFieldValue("coupon", value)
                                        }}
                                        getOptionLabel={(option) => {
                                            return option.code
                                        }}
                                        getOptionSelected={(option, value) => {
                                            return option.id === value.id
                                        }}
                                        
                                        renderInput={(params) => 
                                            <TextField {...params} 
                                            name="coupon"
                                            label="Coupon" 
                                            variant="outlined" />
                                        }
                                    />

                                    {values.user && values.product &&
                                        <span id="generateCoupon" className="red pull-right mt-3 ml-auto" 
                                        style={{cursor: "pointer"}} onClick={() => this.props.onCustomCouponClick() }>
                                            ADD CUSTOM DISCOUNT 
                                        </span>
                                    }

                                </FormControl>


                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>
                                    <InputLabel id="state">State</InputLabel>

                                    <Select
                                        value={values.state}
                                        name={"state"}
                                        onChange={(e) => {
                                            this.props.unsetGeneratedLink()
                                            setFieldValue("state", e.target.value)
                                        }}
                                        label="State">

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        {
                                            this.props.addressStates.map((state) => {
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
                                        <Switch checked={values.applyCredits}
                                                value={values.applyCredits}
                                                onChange={(e) => {
                                                    this.props.onApplyCreditsChange(e)
                                                    setFieldValue("applyCredits", !values.applyCredits) 
                                                }}
                                                className={"pull-left"}
                                                name="applyCredits"
                                        />}
                                    label="Apply Credits"
                                />

                                <Grid container justify="center">
                                    <Button
                                        id="generateLink"
                                        type="submit"
                                        className={classes.root}>
                                        Create
                                    </Button>
                                </Grid>

                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        )
    }
}

export default withStyles(useStyles)(ProductLinkForm)
