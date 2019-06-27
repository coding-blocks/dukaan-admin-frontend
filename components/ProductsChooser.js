import React from 'react';
import "../styles/components/ProductsChooser.scss";

class ProductsChooser extends React.Component {

  /**
   * @param {boolean} props.multiple – Changes if the component should accept
   *  multiple products or not.
   * @param {function} props.productsCallback – Method that is called when the
   *  state of the products array is updated. This supplies the products array back
   *  to the component where it has been used.
   */

  constructor(props) {
    super(props);
    this.state = {
      products: [""]
    };
  }

  /**
   * Adds a new object to the projects array so that another
   * input field shows up.
   * @param {SyntheticEvent} e – event triggered by onClick
   */
  addProduct = (e) => {
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
   */
  setProductName = (e) => {
    let index = e.target.getAttribute("product-index");
    let products = this.state.products;
    products[index] = e.target.value;
    this.setState({
      products
    });
    let productsArray = products.map((key,value) => {
      return key;
    });
    this.props.handleProductsChange(productsArray);
  }

  render() {
    return (
      <div>
        <div id="products_list">
          {
            this.state.products.map((key, index) => {
              return (
                <div 
                  className={"d-flex"}
                  key={`product-`+index}
                >
                  <input 
                    className={"productInput input-text mt-2 col-10"} 
                    placeholder={"Choose Product"} 
                    product-index={index}
                    type={"text"}
                    onChange={this.setProductName}
                    required
                  />
                  <i 
                    className={"fa fa-times align-middle mt-3 d-flex align-items-center justify-content-center ml-4 remove-button red"}
                    product-index={index}
                    onClick={this.removeProduct}
                  />
                </div>
              )
            })
          }
        </div>
        <button 
          className={"button-solid mt-3"}
          onClick={this.addProduct}
        >
          Add More Products
        </button>
      </div>

    )
  }

}

export default ProductsChooser;