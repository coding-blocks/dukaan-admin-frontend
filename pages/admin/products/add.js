import React from 'react';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/admin/products';
import Swal from 'sweetalert2';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import Loader from '../../../components/loader';
import "../../../styles/pages/admin/products.scss";
import ImageChooser from '../../../components/ImageChooser';

class AddProduct extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      queryParams: {
        name: "",
        emi_min_base: 3000,
        emi_min_repeat: 3000,
        description: "",
        mrp: "",
        list_price: "",
        display_slug: "",
        image_url: "",
        listed: false,
        referral: false,
        campaign: false,
        is_offline: false,
        type: "course",
        redirect_url:  "",
        product_category_id: 1
      }
    };
  }

  /**
   * Changes the value of the specified key in the queryParams object
   * in state.
   * @param {SyntheticEvent} event – Handles an event from a form
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
    newQueryParams[event.target.name] = event.target.value;
    this.setState(prevState => ({
      queryParams: newQueryParams
    }));
  };

  /**
   * Handle form submission for add product
   * @param {SyntheticEvent} event – Handles the form submission
   */

  handleAddProduct = (event) => {
    event.preventDefault();
    if (!document.getElementById("addProductForm").checkValidity()) {
      document.getElementById("addProductForm").reportValidity();
    } else {
      this.setState({
        loading: true,
        errorMessage: ''
      });
      controller.handleAddProduct(this.state.queryParams).then((response) => {
        if (response) {
          this.setState({
            loading: false
          });
          Swal.fire({
            title: "Coupon " + this.state.queryParams.name + " added!",
            type: "success",
            showConfirmButton: true
          });
        }
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

  /**
   * Handle checkbox change
   * @param {SyntheticEvent} event – Handles the checkbox change event
   */
  handleCheckboxChange = (event) => {
    let newQueryParams = this.state.queryParams;
    newQueryParams[event.target.name] = event.target.checked;
    this.setState(prevState => ({
      queryParams: newQueryParams
    }));
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Add Product" />
        <Layout />
        <div className={"d-flex align-items-center justify-content-center"}>
          <div className={"border-card col-md-5 mt-5"}>
            {this.state.loading &&
              <Loader />
            }
            {!this.state.loading &&
              <form id="addProductForm" onSubmit={this.handleAddProduct}>
                <div className={"add-product-card"}>

                  {/* Title */}
                  <div className={"d-flex justify-content-center mt-1 pb-3"}>
                    <h2 className={"title"}>Add Product</h2>
                  </div>

                  {/* Name */}
                  <FieldWithElement name={"Name"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Name"
                      name="name"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Description */}
                  <FieldWithElement name={"Description"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Description"
                      name="description"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>
                  
                  {/* Description */}
                  <FieldWithElement name={"Display Slug"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Display Slug"
                      name="display_slug"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* MRP (Rs.) */}
                  <FieldWithElement name={"MRP"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter MRP"
                      name="mrp"
                      title="MRP should be a number of 3 to 10 digits"
                      pattern={"[0-9]{3,10}"}
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* List Price (Rs.) */}
                  <FieldWithElement name={"List Price"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter List Price"
                      name="list_price"
                      onChange={this.handleQueryParamChange}
                      pattern={"[0-9]{3,10}"}
                      title="List Price should be a number of 3 to 10 digits"
                      required
                    />
                  </FieldWithElement>

                  {/* Image URL */}
                  <FieldWithElement name={"Image URL"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    {this.state.queryParams.image_url && 
                      <img 
                        src={this.state.queryParams.image_url}
                        width={100}
                        height={100}
                      />
                    }
                    <div className={"pb-3"}>
                      <input
                        type="text"
                        className={"input-text"}
                        placeholder="Enter Image URL"
                        name="image_url"
                        defaultValue={this.state.queryParams.image_url}
                        onChange={this.handleQueryParamChange}
                        required
                      />
                    </div>
                    <ImageChooser
                      callback={(image_url) => {
                        let queryParams = this.state.queryParams;
                        queryParams.image_url = image_url;
                        this.setState({
                          queryParams
                        });
                      }}
                    />
                  </FieldWithElement>

                  {/* Image URL */}
                  <FieldWithElement name={"Redirect URL"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                    <input
                      type="text"
                      className="input-text"
                      placeholder="Enter Redirect URL"
                      name="redirect_url"
                      onChange={this.handleQueryParamChange}
                      required
                    />
                  </FieldWithElement>

                  {/* Type */}
                  <FieldWithElement name={"Type"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                  <select 
                      name="type"
                      onChange={this.handleQueryParamChange}
                      required
                    >
                      <option value="course">Course</option>
                      <option value="test">Test</option>
                    </select>
                  </FieldWithElement>
                  
                  <div className={"checkboxes"}>
                    <input 
                      type="checkbox" 
                      onChange={this.handleCheckboxChange} 
                      name="referral" 
                      value="Referral" />Referral
                    <input 
                      type="checkbox" 
                      onChange={this.handleCheckboxChange} 
                      name="campaign" 
                      value="Campaign" />Campaign
                    <input 
                      type="checkbox" 
                      onChange={this.handleCheckboxChange}
                      name="is_offline" 
                      value="Is Offline?" />Is Offline?
                    <input 
                      type="checkbox" 
                      onChange={this.handleCheckboxChange}
                      name="listed" 
                      value="Listed?" />Listed?
                  </div>
                  <div className={"d-flex justify-content-center"}>
                    <div
                      id="search"
                      className={"button-solid ml-4 mb-2 pl-5 pr-5"}
                      onClick={this.handleAddProduct}
                    >
                      Add
                    </div>
                  </div>
                </div>
              </form>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default AddProduct;