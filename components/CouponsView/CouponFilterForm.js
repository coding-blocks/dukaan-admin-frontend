import React from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import * as controller from '../../controllers/v2/couponsV2'
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorHandler from "../../helpers/ErrorHandler";


class CouponFilterForm extends React.Component {

    constructor(props) {
        super()
        this.state = {
            categories: [],
            subCategories: [],
            filterParams: {
                active: true,
            }
        }
    }


    componentDidMount() {
        controller.fetchAllCouponCategories().then((response) => {
            this.setState({
                categories: response.data
            })
        })

    }

    fillSubCategories = (data) => {
        controller.fetchSubCategories(data).then((subCategories) => {
            this.setState({
                subCategories: subCategories.data
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    };

    handleCategoryChange = (event) => {
        this.setState({
            filterParams: {
                ...this.state.filterParams,
                category: event.target.value
            }
        }, () => {
            this.fillSubCategories({category: event.target.value})
        });
    }

    onFormInputChange = (event) => {
        let newFilterParams = this.state.filterParams;
        newFilterParams[event.target.name] = (event.target.name === 'active' ? !JSON.parse(event.target.value) : event.target.value)
        this.setState(prevState => ({
          filterParams: newFilterParams
        }));
    }

    onSearchBtnClick = () => {
        this.props.onSearchBtnClick(this.state.filterParams)
    }

    render() {
        if (!this.state.categories) {
            return <CircularProgress/>
        }
        return (

            <div className={"d-flex col-md-8 offset-2 mt-5"}>

                <div className={"border-card coupon-card"}>
                    {/* Title */}
                    <div className={"d-flex justify-content-center mt-1 mb-3 pb-3"}>
                        <h2 className={"title"}>
                            Search Coupons
                        </h2>
                    </div>

                    <div>
                        <form noValidate autoComplete="off">
                            {/* Code */}
                            <TextField
                                className={"mb-4"} id="outlined-basic" label="Code" type={"string"}
                                fullWidth={true} name={"code"} value={this.state.filterParams.code}
                                onChange={this.onFormInputChange} variant="outlined"/>

                            {/* Category */}
                            <FormControl variant="outlined" size={"medium"}
                                         fullWidth={true} className={"mb-4"}>
                                <InputLabel id="coupon-category">Category</InputLabel>
                                <Select
                                    value={this.state.filterParams.category}
                                    name={"category"}
                                    onChange={this.handleCategoryChange}
                                    label="Category">
                                    <MenuItem value="All Categories">
                                        <em>All Categories</em>
                                    </MenuItem>
                                    {
                                        this.state.categories.map((category) => {
                                            return (
                                                <MenuItem
                                                    key={category}
                                                    value={category}>{
                                                    category.split('_').join(' ')
                                                }</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>

                            {/* Sub Category */}
                            <FormControl variant="outlined" size={"medium"}
                                         fullWidth={true} className={"mb-4"}>
                                <InputLabel id="coupon-sub-category">Sub Category</InputLabel>
                                <Select
                                    value={this.state.filterParams.subCategoryId}
                                    label="Sub Category"
                                    name={"subCategoryId"}
                                    onChange={this.onFormInputChange}>
                                    <MenuItem value="All Sub Categories">
                                        <em>All Sub Categories</em>
                                    </MenuItem>
                                    {
                                        this.state.subCategories.map((subCategory) => {
                                            return (
                                                <MenuItem
                                                    key={subCategory.id}
                                                    value={subCategory.id}>{
                                                    subCategory.name
                                                }</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>


                            {/* Discount Mode */}
                            <FormControl variant="outlined" size={"medium"}
                                         fullWidth={true} className={"mb-4"}>
                                <InputLabel id="coupon-mode">Discount Mode</InputLabel>
                                <Select
                                    value={this.state.filterParams.mode}
                                    onChange={this.onFormInputChange}
                                    name={"mode"}
                                    label="Discount Mode">
                                    <MenuItem value="">
                                        <em>All</em>
                                    </MenuItem>
                                    <MenuItem value="flat">
                                        <em>Flat</em>
                                    </MenuItem>
                                    <MenuItem value="percentage">
                                        <em>Percentage</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>


                            {/* Amount */}
                            <TextField
                                id="outlined-basic" className={"mb-4"} label="Amount" type={"number"}
                                name={"amount"} fullWidth={true} inputProps={{
                                max: 99999,
                            }}
                                value={this.state.filterParams.amount}
                                onChange={this.onFormInputChange} variant="outlined"/>


                            {/* Active */}
                            <FormControlLabel
                                className={"mb-4"}
                                control={
                                    <Switch checked={this.state.filterParams.active}
                                            onChange={this.onFormInputChange}
                                            value={this.state.filterParams.active}
                                            name="active"
                                    />}
                                label="Show Inactive"
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


export default CouponFilterForm
