import React from 'react';
import Select from 'react-select';
import productsController from "../controllers/products";
import Swal from 'sweetalert2';

class ProductsChooser extends React.Component {

  /**
   * @param {boolean} props.multiple – Changes if the component should accept
   *  multiple products or not.
   * @param {function} props.productsCallback – Method that is called when the
   *  state of the products array is updated. This supplies the products array back
   *  to the component where it has been used.
   * @param {array} props.products – Array of product ids that allow you to populate the
   *  ProductsChooser component with a list of products.
   * @param {boolean} props.all – Changes if the dropdown should have an option to
   *  show the "All Products" option
   */

  constructor(props) {
    super(props);
    this.state = {
      products: props.products || [],
      organizationId: this.props.organization_id,
      productType: this.props.productType,
      all: props.all || false,
      productsList: [
        {
          id: 0,
          name: "Fetching..."
        }
      ],
      singleProductID: ''
    };
  }

  fetchProducts = () => {
    // Fetch all products
    productsController.handleGetProducts({
      organization_id: this.state.organizationId,
      type: this.state.productType
    }, { page: 1, limit: 300 }).then((res) => {
      this.setState({
        productsList: res.results
      });
    }).catch((error) => {
      Swal.fire({
        type: "error",
        title: "Error fetching Products!",
        text: error
      });
    });
  }


  componentDidMount() {

    console.log('Component did mount called');
    if (this.state.products.length == 0) {
      this.setState({
        products: ["0"]
      });
    }
    this.fetchProducts()

  }


  /**
   * Adds a new object to the projects array so that another
   * input field shows up.
   * @param {SyntheticEvent} e – event triggered by onClick
   */
  addProduct = (e, index) => {
    e.preventDefault();
    this.setState({
      products: this.state.products.concat("")
    });
  }

  /**
   * Gets the ID of the product field from the event and removes
   * it from the products array.
   * @param {SyntheticEvent} e – event triggered by onClick
   */
  removeProduct = (e) => {
    let index = e.target.getAttribute("product-index");
    let products = this.state.products;
    products.splice(index, 1);
    this.setState({
      products
    });
  }

  /**
   * Gets the ID of the product field from the event and sets the
   * name of the product accordingly. Then, it calls the callback
   * function passed via the props to update it to the state of the
   * component where it is imported.
   * @param {SyntheticEvent} e – event triggered by onChange
   * @param {int} index – the index of the list of all select objects;
   *  the first select box is going to be index 0 (etc.)
   */
  setProductName = (e, index) => {
    let products = this.state.products;
    products[index] = e.value.toString();
    this.setState({
      products
    });
    let productsArray = products.map((key, value) => {
      return key.toString();
    });
    this.props.productsCallback(productsArray);
  }

  /**
   * If props.multiple is not true, then this is
   * called when the Select is changed
   * @param {SyntheticEvent} e – event triggered by onChange
   */
  setSingleProductID = (e) => {
    this.setState({
      singleProductID: e.value
    });
    this.props.productsCallback(e.value);
  }

  /**
   * Get product from list
   */
  findProductNameByID = (id) => {
    if (id.toString() == "") {
      return "";
    }
    const productObject = this.state.productsList.find(p => p.id == id);
    const name = typeof productObject == 'undefined' ? "Choose a product" : productObject.description;
    return name;
  }

  render() {
    let productsListTags = this.state.productsList.map((p) => {
      return { "value": p.id, "label": p.name }
    }
    )
    if (this.state.all) {
      productsListTags = [{ "value": "", "label": "All Products" }, ...productsListTags];
    }
    return (
      <div>
        <div id="products_list">
          {
            !this.props.multiple &&
            <Select
              className={"productInput mt-2 col-12"}
              placeholder={"Choose Product"}
              defaultValue={{ value: "", label: "All Products" }}
              type={"text"}
              onChange={this.setSingleProductID}
              required
              options={productsListTags}
            />
          }
          {
            this.props.multiple &&
            this.state.productsList.length > 0 &&
            this.state.products.map((key, index) => {
              return (
                <div
                  className={"d-flex"}
                  key={`product-` + index}
                >
                  <Select
                    className={"productInput mt-2 col-10"}
                    product-index={index}
                    type={"text"}
                    placeholder={"Choose a product"}
                    value={{ label: this.findProductNameByID(key), value: parseInt(key) }}
                    onChange={(e) => { this.setProductName(e, index) }}
                    options={productsListTags}
                    required
                  />
                  {this.state.products.length > 1 &&
                    <i
                      className={"fa fa-times align-middle mt-3 d-flex align-items-center justify-content-center ml-4 remove-button red"}
                      product-index={index}
                      onClick={this.removeProduct}
                    />
                  }
                  {
                    this.state.products.length == 1 &&
                    <i
                      className={"fa fa-times align-middle mt-3 d-flex align-items-center justify-content-center ml-4 remove-button red disabled"}
                      product-index={index}
                    />
                  }
                </div>
              )
            })
          }
        </div>
        {
          this.props.multiple &&
          <button
            className={"button-solid d-flex mt-3"}
            onClick={this.addProduct}
          >
            Add More Products
          </button>
        }
      </div>

    )
  }

}

export default ProductsChooser;
