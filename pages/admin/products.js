import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/layout";
import FieldWithElement from '../../components/FieldWithElement';
import controller from "../../controllers/products.js";
import Loader from '../../components/loader';
import Pagination from "../../components/Pagination";
import EditProduct from "../../components/EditProduct";
import Formatter from '../../helpers/formatter';
import Modal from 'react-modal';
import CheckLogin from "../../components/CheckLogin";

class Products extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      queryParams: {},
      results: [],
      pageInfoQuery: {
        page: 1,
        limit: 5
      },
      pagesInfo: {},
      loading: false,
      showEditProductModal: false,
      editProductData: {}
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
   * Callback for page change
   * @param {int} offset
   */
  handleChangePage = (page) => {
    let pageInfoQuery = this.state.pageInfoQuery;
    pageInfoQuery['page'] = page;
    this.setState({
      pageInfoQuery
    });
    this.handleProductSearch();
  }

  /**
   * Product search action method
   */
  handleProductSearch = () => {
    this.setState({
      loading: true
    })
    controller.handleGetProducts(this.state.queryParams, this.state.pageInfoQuery).then((response) => {
      this.setState({
        loading: false,
        results: response.results,
        pagesInfo: response.pagesInfo
      });
    }).catch((error) => {
      Swal.fire({
        type: 'error',
        title: 'Error while fetching products!',
        text: error
      });
      this.setState({
        loading: false
      });
    });
  }

  /**
   * Edit Product close modal
   */
  closeEditProductModal = () => {
    this.setState({
      showEditProductModal: false,
      editProductData: {}
    })
  }

  /**
   * Edit Product action handler.
   * @param {object} product
   */
  handleEditProduct = (product) => {
    this.setState({
      showEditProductModal: true,
      editProductData: product
    })
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Products" />
        <Layout/>
        <CheckLogin>
          <Modal
            isOpen={this.state.showEditProductModal}
            onRequestClose={this.closeEditProductModal}
          >
            <EditProduct
              product={this.state.editProductData}
              callback={(newProduct) => {
                this.closeEditProductModal();
                Swal.mixin({
                  toast: true,
                  position: "center",
                  showConfirmButton: false,
                  timer: 3000
                }).fire({
                  type: 'success',
                  title: 'Product Edited Successfully'
                })
                let products = this.state.results;
                let productIndex = this.state.results.indexOf(product);
                products[productIndex] = newProduct;
                this.setState({
                  results: products
                });
              }}
            />
          </Modal>
          <div className={"mr-5 pr-5"}>
            {/* Product Search */}
            <div className={"d-flex justify-content-center"}>
              <div className={"mt-5 ml-5 col-4"}>
                <div className={"border-card"}>

                  {/* Title */}
                  <div className={"d-flex justify-content-center mt-1 pb-3"}>
                    <h2 className={"title"}>
                      Search Products
                  </h2>
                  </div>

                  {/* Name */}
                  <FieldWithElement
                    nameCols={3}
                    elementCols={9}
                    name={"Name"}
                  >
                    <input
                      type="text"
                      autoFocus
                      className={"input-text"}
                      placeholder="Enter Product Name"
                      name={"name"}
                      onChange={this.handleQueryParamChange}
                    />
                  </FieldWithElement>

                  {/* Results per page */}
                  <FieldWithElement
                    name={"Results per page"}
                    nameCols={5}
                    elementCols={7}
                    elementClassName={"pl-4"}
                  >
                    <input
                      type="text"
                      className={"input-text"}
                      placeholder="Enter Results Per Page..."
                      name="limit"
                      defaultValue={5}
                      onChange={(event) => {
                        let pageInfoQuery = this.state.pageInfoQuery;
                        pageInfoQuery['limit'] = event.target.value;
                        this.setState({
                          pageInfoQuery
                        });
                      }}
                    />
                  </FieldWithElement>

                  <div className={"d-flex justify-content-center"}>
                    <button
                      id="search"
                      className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                      onClick={this.handleProductSearch}
                    >
                      Search
                  </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Product Results */}
            {!this.state.loading && this.state.results.length > 0 &&
              <div className={`ml-5 mt-5 col-md-12`}>
                <div className={"border-card"}>
                  {/* Title */}
                  <div className={"d-flex justify-content-center mt-1"}>
                    <h2 className={"title"}>Products Results</h2>
                  </div>
                  {/* Results Table */}
                  <div className={"c-overview-leaderboard coupons"}>
                    <table className={"table table-responsive products-results-table"}>
                      <thead className={"red"}>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>MRP</th>
                          <th>List Price</th>
                          <th>Display Slug</th>
                          <th>Listed</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody className={`t-align-c`}>
                        {
                          this.state.results.map(p => (
                            <tr key={p.id}>
                              <td className={"product-name"}>
                                <img src={p.image_url} className={"product-image"} align={"absmiddle"}></img>
                                <span className={"name"}>{p.name}</span>
                              </td>
                              <td className={"product-description"}>{p.description}</td>
                              <td>{Formatter.formatCurrency(p.mrp)}</td>
                              <td>{Formatter.formatCurrency(p.list_price)}</td>
                              <td>{p.display_slug}</td>
                              <td>{ JSON.parse(p.listed) ? "Yes" : "No" }</td>
                              <td>
                                <button
                                  className={"button-solid btn btn-default"}
                                  onClick={() => { this.handleEditProduct(p) }}>
                                  Edit
                              </button>
                              </td>
                            </tr>
                          )
                          )}
                      </tbody>
                    </table>
                  </div>
                  <div className={"col-md-12 pt-4"}>
                    <Pagination
                      pagesInfo={this.state.pagesInfo}
                      changePageCallback={this.handleChangePage}
                    />
                  </div>
                </div>
              </div>
            }
            {/* Loader */}
            {this.state.loading &&
              <div className={"border-card mt-3 loading-container"}>
                <Loader />
              </div>
            }
          </div>
        </CheckLogin>
      </div>
    );
  }

}

export default Products;