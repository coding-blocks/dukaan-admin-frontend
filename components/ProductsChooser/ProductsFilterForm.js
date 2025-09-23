import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from "@material-ui/core/Grid";
import Switch from '@material-ui/core/Switch';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as productCategoryController from '../../controllers/productCategories';
import * as productTypeController from '../../controllers/productTypes';

class ProductsFilterForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            productTypes: [],
            loading: false,
            filterParams: {
                name: '',
                listed: true,
                product_category_id: '',
                product_type_id: '',
                type: ''
            }
        };
    }

    componentDidMount() {
        this.fetchCategories();
        this.fetchProductTypes();
    }

    fetchCategories = async () => {
        try {
            this.setState({ loading: true });
            const response = await productCategoryController.handleGetAllProductCategories();
            this.setState({ 
                categories: response.data,
                loading: false 
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
            this.setState({ loading: false });
        }
    }

    fetchProductTypes = async () => {
        try {
            this.setState({ loading: true });
            const response = await productTypeController.getAllProductTypes();
            this.setState({ 
                productTypes: response.data,
                loading: false 
            });
        } catch (error) {
            console.error('Error fetching product types:', error);
            this.setState({ loading: false });
        }
    }

    onFormInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        
        this.setState(prevState => ({
            filterParams: {
                ...prevState.filterParams,
                [name]: type === 'checkbox' ? checked : (value === '' ? undefined : value)
            }
        }));
    }

    onSearchBtnClick = () => {
        const cleanedParams = {};
        
        Object.keys(this.state.filterParams).forEach(key => {
            const value = this.state.filterParams[key];
            
            if (value !== '' && value !== null && value !== undefined) {
                if (['product_category_id', 'product_type_id', 'center_id'].includes(key)) {
                    cleanedParams[key] = parseInt(value, 10);
                } else {
                    cleanedParams[key] = value;
                }
            }
        });
        
        this.props.onSearchBtnClick(cleanedParams);
    }

    handleFormSubmit = (e) => {
        e.preventDefault(); 
        this.onSearchBtnClick();
    }

    render() {
        if (this.state.loading) {
            return <CircularProgress/>;
        }

        return (
            <div className={"d-flex col-md-11 offset-1 mt-5"}>
                <div className={"border-card coupon-card"}>
                    <div className={"d-flex justify-content-center mt-1 mb-3 pb-3"}>
                        <h2 className={"title"}>Search Products</h2>
                    </div>
                    <form noValidate autoComplete="off" onSubmit={this.handleFormSubmit}>
                        <TextField
                            className={"mb-4"} 
                            label="Product Name" 
                            type="text"
                            fullWidth={true} 
                            name="name" 
                            value={this.state.filterParams.name}
                            onChange={this.onFormInputChange} 
                            variant="outlined"
                        />

                        <FormControl variant="outlined" fullWidth={true} className={"mb-4"}>
                            <InputLabel id="product-category">Category</InputLabel>
                            <Select
                                value={this.state.filterParams.product_category_id}
                                name="product_category_id"
                                onChange={this.onFormInputChange}
                                label="Category"
                            >
                                <MenuItem value=""><em>All Categories</em></MenuItem>
                                {this.state.categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth={true} className={"mb-4"}>
                            <InputLabel id="product-type">Product Type</InputLabel>
                            <Select
                                value={this.state.filterParams.product_type_id}
                                name="product_type_id"
                                onChange={this.onFormInputChange}
                                label="Product Type"
                            >
                                <MenuItem value=""><em>All Types</em></MenuItem>
                                {this.state.productTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl variant="outlined" fullWidth={true} className={"mb-4"}>
                            <InputLabel id="main-type">Main Type</InputLabel>
                            <Select
                                value={this.state.filterParams.type}
                                name="type"
                                onChange={this.onFormInputChange}
                                label="Main Type"
                            >
                                <MenuItem value=""><em>All Types</em></MenuItem>
                                <MenuItem value="course">Course</MenuItem>
                                <MenuItem value="test">Test</MenuItem>
                                <MenuItem value="book">Book</MenuItem>
                                <MenuItem value="extension">Extension</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            className={"mb-4"}
                            control={
                                <Switch 
                                    checked={this.state.filterParams.listed}
                                    onChange={this.onFormInputChange}
                                    name="listed"
                                />
                            }
                            label="Show Listed Only"
                        />

                        <Grid container justify="center" spacing={2}>
                            <Grid item>
                                <Button
                                    size="medium" 
                                    type="submit"
                                    variant="outlined" 
                                    className="btn-solid"
                                    style={{
                                        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                        color: 'white', 
                                        border: 0,
                                        borderRadius: 3, 
                                        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
                                    }} 
                                >
                                    Search
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProductsFilterForm;