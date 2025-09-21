import React from 'react';
import {withRouter} from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/coupons';
import organizationController from '../../../controllers/organizations';
import Swal from 'sweetalert2';
import ProductsChooser from "../../../components/ProductsChooser";
import CheckLogin from "../../../components/CheckLogin";
import ErrorHandler from "../../../helpers/ErrorHandler";
import DatePicker from "react-datepicker";

class AddCoupon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            organizations: [],
            queryParams: {
                authority_doc: "",
                code: "",
                organization_id: null,
                products: [],
                type: "online",
                mode: "flat",
                left: 1,
                category: "special_discount",
                active: false,
                extensions: [],
                max_discount: null,
                valid_start: new Date(),
                valid_end: new Date().setMonth(new Date().getMonth() + 1)
            },
        };
    }

    /**
     * Changes the value of the specified key in the queryParams object
     * in state.
     * @param {SyntheticEvent} event – Handles an event from a form
     * @example
     *  <input
     *   type="text"
     *   name="email"
     *   onChange={this.handleQueryParamChange}
     *  />
     *  // Changes the value of this.state.queryParams.email
     */
    handleQueryParamChange = (event) => {
        let newQueryParams = this.state.queryParams;
        if (event.target.name === 'allProducts'
            || event.target.name === 'allExtensions'
            || event.target.name === 'active') {
            newQueryParams[event.target.name] = event.target.checked;
        } else {
            newQueryParams[event.target.name] = event.target.value;
        }
        if (event.target.name === 'organization_id') {
            newQueryParams['organization_id'] = Number(event.target.value);
        }
        this.setState(prevState => ({
            queryParams: newQueryParams
        }));
    };

    /**
     * Callback function for ProductsChooser component that updates
     * them in the state when ProductsChooser returns an array of
     * products added
     * @param {array} products – Array of with the names of products
     */
    handleProductsChange = (products) => {
        let queryParams = this.state.queryParams;
        queryParams['products'] = products;
        this.setState({
            queryParams
        })
    }

    handleExtensionsChange = (extensions) => {
        let queryParams = this.state.queryParams;
        queryParams['extensions'] = extensions;
        this.setState({
            queryParams
        })
    }

    setStartDate = (date) => {
        const queryParams = {...this.state.queryParams}
        queryParams.valid_start = date
        this.setState({queryParams})
    }

    setEndDate = (date) => {
        const queryParams = {...this.state.queryParams}
        queryParams.valid_end = date
        this.setState({queryParams})
    }

    componentDidMount() {
        organizationController.getAllOrganizations().then((response) => {
            if (response) {
                let oldQueryParams = this.state.queryParams;
                oldQueryParams.organization_id = response.data[0].id
                this.setState({
                    organizations: response.data,
                    queryParams: oldQueryParams
                })
            }
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    /**
     * Method to handle saving of coupon
     */




    handleAddCoupon = (event) => {
        event.preventDefault();
        // Show the loading icon
        if (!document.getElementById("addCouponForm").checkValidity()) {
            document.getElementById("addCouponForm").reportValidity();
        } else {
            this.setState({
                loading: true,
            });

            const toSubmit = this.state.queryParams;
            toSubmit['products'] = [...this.state.queryParams.products, ...this.state.queryParams.extensions]
            controller.handleAddCoupon(toSubmit).then((response) => {
                this.setState({
                    loading: false
                });
                Swal.fire({
                    title: "Coupon " + this.state.queryParams.code + " added!",
                    type: "success",
                    showConfirmButton: true
                });
            }).catch((error) => {
                this.setState({
                    loading: false
                });
                Swal.fire({
                    title: "Error adding coupon!",
                    text: error,
                    type: "error",
                    showConfirmButton: true
                });
            });
        }
    }


    setRandomCouponCode = () => {
        let newQueryParams = this.state.queryParams;
        newQueryParams.code = controller.generateRandomCouponCode()
        this.setState({
            queryParams: newQueryParams
        })
    }

    render() {
        if (!this.state.queryParams.organization_id) {
            return <div>Loading...</div>
        }
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Add Coupon"/>
                <Layout/>
                <CheckLogin>
                    <div className={"d-flex align-items-center justify-content-center"}>
                        <div className={"border-card coupon-card col-md-4 mt-5"}>
                            {this.state.loading &&
                            <Loader/>
                            }
                            {!this.state.loading &&
                            <form id="addCouponForm" onSubmit={(e) => e.preventDefault()}>
                                <div className={"add-coupon-card"}>

                                    {/* Title */}
                                    <div className={"d-flex justify-content-center mt-1 pb-3"}>
                                        <h2 className={"title"}>Add Coupon</h2>
                                    </div>

                                    {/* organization */}
                                    <FieldWithElement name={"Organization"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <select
                                            id="organization_id"
                                            name="organization_id"
                                            onChange={this.handleQueryParamChange}
                                            required>
                                            {
                                                this.state.organizations.map((organization) => {
                                                    return (
                                                        <option value={Number(organization.id)} key={organization.id}>
                                                            {organization.name}
                                                        </option>)
                                                })
                                            }
                                        </select>
                                    </FieldWithElement>

                                    {/* Code */}
                                    <FieldWithElement name={"Code*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <input
                                            type="text"
                                            id="code"
                                            className="input-text"
                                            placeholder="Enter Code"
                                            name="code"
                                            value={this.state.queryParams.code}
                                            onChange={this.handleQueryParamChange}
                                            required
                                        />
                                    </FieldWithElement>

                                    {/* Generate Random Code */}
                                    <FieldWithElement name={"Generate Code"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <button
                                            id="search"
                                            type={"button"}
                                            className={"button-solid ml-4 pr-5"}
                                            onClick={this.setRandomCouponCode}>
                                            Generate Random Code
                                        </button>
                                    </FieldWithElement>

                                    {/* Authority_code */}
                                    <FieldWithElement name={"Description*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <input
                                            type="text"
                                            className="input-text"
                                            placeholder="Enter Description"
                                            name="authority_doc"
                                            value={this.state.queryParams.authority_doc}
                                            onChange={this.handleQueryParamChange}
                                            required
                                        />
                                    </FieldWithElement>
                                    {/* Categories */}
                                    <FieldWithElement name={"Category*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <select
                                            id="category"
                                            name="category"
                                            onChange={this.handleQueryParamChange}
                                            value={this.state.queryParams.category}
                                            required
                                        >
                                            <option value="special_discount">Special Discount</option>
                                            <option value="campaign">Campaign</option>
                                            <option value="campus_ambassador">Campus Ambassador</option>
                                        </select>
                                    </FieldWithElement>

                                    {/* Products */}
                                    <FieldWithElement name={"Course/Premium/Lite Products"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <ProductsChooser
                                            productsCallback={this.handleProductsChange}
                                            multiple={true}
                                            productType={'course'}
                                            key={this.state.queryParams.organization_id}
                                            organization_id={this.state.queryParams.organization_id}
                                        />
                                    </FieldWithElement>


                                    {/* Extensions */}
                                    <FieldWithElement name={"Extension Products"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <ProductsChooser
                                            productsCallback={this.handleExtensionsChange}
                                            multiple={true}
                                            productType={'extension'}
                                            key={this.state.queryParams.organization_id}
                                            organization_id={this.state.queryParams.organization_id}
                                        />
                                    </FieldWithElement>


                                    {/* Start Date */}
                                    <FieldWithElement name={"Validity Start Date"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <DatePicker
                                            showTimeSelect
                                            timeFormat="HH:mm:ss"
                                            timeIntervals={60}
                                            timeCaption="time"
                                            minDate ={new Date()}
                                            onChange={this.setStartDate}
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            selected={this.state.queryParams.valid_start}
                                        />
                                    </FieldWithElement>

                                    {/* End Date */}
                                    <FieldWithElement name={"Validity End Date"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <DatePicker
                                            showTimeSelect
                                            timeFormat="HH:mm:ss"
                                            timeIntervals={60}
                                            minDate ={new Date()}
                                            onChange={this.setEndDate}
                                            timeCaption="time"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            selected={this.state.queryParams.valid_end}
                                        />
                                    </FieldWithElement>

                                    {/* Mode */}
                                    <FieldWithElement name={"Mode*"} nameCols={3} elementCols={9}
                                                      elementClassName={"pl-4"}>
                                        <select
                                            id="mode"
                                            name="mode"
                                            onChange={this.handleQueryParamChange}
                                            value={this.state.queryParams.mode}
                                            required
                                        >
                                            <option value="flat">Flat</option>
                                            <option value="percentage">Percentage</option>
                                        </select>
                                    </FieldWithElement>

                                    {this.state.queryParams.mode == "flat" &&
                                    /* Amount */
                                    <FieldWithElement
                                        name={"Discount*"}
                                        nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Enter discount value"
                                            name="amount"
                                            onChange={this.handleQueryParamChange}
                                            title="Discount can only have 3 to 10 digit numbers"
                                            required
                                        />
                                    </FieldWithElement>
                                    }

                                    {this.state.queryParams.mode == "percentage" &&
                                    /* Percentage */
                                    <div>
                                        <FieldWithElement
                                            name={"Percentage*"}
                                            nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                            <input
                                                type="text"
                                                className={"input-text"}
                                                placeholder="Enter Percentage"
                                                name="percentage"
                                                value={this.state.queryParams.percentage}
                                                onChange={this.handleQueryParamChange}
                                                required
                                            />
                                        </FieldWithElement>

                                        <FieldWithElement
                                            name={"Max discount"}
                                            nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                                            <input
                                                type="text"
                                                className={"input-text"}
                                                placeholder="Enter Max Discount Applicable"
                                                name="max_discount"
                                                value={this.state.queryParams.max_discount}
                                                onChange={this.handleQueryParamChange}
                                            />
                                        </FieldWithElement>
                                    </div>
                                    }

                                    {/* Total number of times a coupon can be used*/}
                                    <FieldWithElement name={"How many times it can be used?*"} nameCols={6}
                                                      elementCols={6} elementClassName={"pl-4"}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Enter Left"
                                            name="left"
                                            onChange={this.handleQueryParamChange}
                                            value={this.state.queryParams.left}
                                            min={1}
                                            title="Left can only have numbers"
                                            required
                                        />
                                    </FieldWithElement>

                                    {/* All Listed Products? */}
                                    <div className={"mt-3 row d-flex"}>
                                        <div className={"col-md-6"}>
                                            <span className="text">Add All Listed Products?</span>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <input
                                                className={"ml-4 mt-3"}
                                                type="checkbox"
                                                onChange={this.handleQueryParamChange}
                                                value={this.state.queryParams.allProducts}
                                                name="allProducts"/>
                                        </div>
                                    </div>
                                    {/* Min price */}
                                    <FieldWithElement name={"Minimum Product Price?"} nameCols={6} elementCols={6}
                                                      elementClassName={"pl-4"}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Min product price"
                                            name="minProductPrice"
                                            onChange={this.handleQueryParamChange}
                                            value={this.state.queryParams.minProductPrice}
                                            title="minProductPrice can only have numbers"
                                        />
                                    </FieldWithElement>

                                    {/* All Listed Extensions? */}
                                    <div className={"mt-3 row d-flex"}>
                                        <div className={"col-md-6"}>
                                            <span className="text">Add All Listed Extensions?</span>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <input
                                                className={"ml-4 mt-3"}
                                                type="checkbox"
                                                onChange={this.handleQueryParamChange}
                                                value={this.state.queryParams.allExtensions}
                                                name="allExtensions"/>
                                        </div>
                                    </div>
                                    {/* Min price */}
                                    <FieldWithElement name={"Minimum Extension Price?"} nameCols={6} elementCols={6}
                                                      elementClassName={"pl-4"}>
                                        <input
                                            type="number"
                                            className={"input-text"}
                                            placeholder="Min extension price"
                                            name="minExtensionPrice"
                                            onChange={this.handleQueryParamChange}
                                            value={this.state.queryParams.minExtensionPrice}
                                            title="minExtensionPrice can only have numbers"
                                        />
                                    </FieldWithElement>

                                    {/* Active */}
                                    <div className={"mt-3 row d-flex"}>
                                        <div className={"col-md-6"}>
                                            <span className="text">Activate</span>
                                        </div>
                                        <div className={"col-md-6"}>
                                            <input
                                                className={"ml-4 mt-3"}
                                                type="checkbox"
                                                onChange={this.handleQueryParamChange}
                                                value={this.state.queryParams.active}
                                                name="active"/>
                                        </div>

                                    </div>

                                    <div className={"d-flex justify-content-center"}>
                                        <button
                                            id="search"
                                            className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                                            onClick={this.handleAddCoupon}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </form>
                            }
                        </div>
                    </div>
                </CheckLogin>
            </div>
        )
    }

}

export default withRouter(AddCoupon);
