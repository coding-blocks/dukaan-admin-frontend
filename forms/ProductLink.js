import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import config from "../config";
import ErrorHandler from "../helpers/ErrorHandler";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {Formik, Field} from 'formik';
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
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
    sub_category_id: '',
    coupon: ''
}

class ProductLinkForm extends React.Component {

    constructor(props) {
        super(props)
    }

    generateLink = (fields) => {

        const productId = fields.product.id
        const oneauthId = fields.user.oneauth_id

        let useCreditsQueryParams = ''
        if (fields.applyCredits)
            useCreditsQueryParams = '&useCredits=true'

        let couponQueryParams = ''
        if (fields.coupon)
            couponQueryParams = `&coupon=${fields.coupon}`

        const link = `https://dukaan.codingblocks.com/buy?productId=${productId}&oneauthId=${oneauthId}${useCreditsQueryParams}
                        ${couponQueryParams}`

        this.props.ongenerateLink(link)
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
                        onSubmit={this.generateLink}>

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
                                            setFieldValue("sub_category_id", '')
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
                                                        value={center.id}>{
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
                                            setFieldValue("sub_category_id", '')
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
                                        label="Coupon category"
                                        onChange={(e) => {
                                            this.props.handleCategoryChange(e)
                                            setFieldValue("category", e.target.value)
                                            setFieldValue("sub_category_id", '')

                                        }}
                                        disabled={!this.props.product || !this.props.user}
                                        >

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>
                                        <MenuItem value="special_discount"> Special Discount </MenuItem>
                                        <MenuItem value="telecounselor"> Telecounselor </MenuItem>
                                    </Select>
                                </FormControl>


                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>
                                    <InputLabel id="sub_category_id">Coupon sub category</InputLabel>

                                    <Select
                                        value={values.sub_category_id}
                                        name={"Sub Category"}
                                        label="Coupon sub category"
                                        onChange={(e) => {
                                            this.props.handleSubCategoryChange(values.category, e.target.value)
                                            setFieldValue("sub_category_id", e.target.value)
                                        }}>

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>

                                        {
                                            this.props.subCategories.map((subCategory) => {
                                                return (
                                                    <MenuItem key={subCategory.id} 
                                                        value={subCategory.id}>
                                                        {subCategory.name}
                                                    </MenuItem>
                                                    )
                                            })
                                        }
                                    </Select>
                                </FormControl>


                                <FormControl variant="outlined" size={"medium"}
                                    fullWidth={true} className={"mb-4"}>
                                    <InputLabel id="coupon">Coupon</InputLabel>

                                    <Select
                                        value={values.coupon}
                                        name={"coupon"}
                                        label="coupon"
                                        onChange={handleChange}>

                                        <MenuItem value="">
                                            <em>Select</em>
                                        </MenuItem>

                                        {
                                            this.props.coupons.map((coupon) => {
                                                return (
                                                    <MenuItem key={coupon.id} 
                                                        value={coupon.code}>
                                                        {coupon.code}
                                                    </MenuItem>
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
