import React from 'react';
import Head from "../../components/head";
import Layout from "../../components/layout";
import ProductsFilterForm from '../../components/ProductsChooser/ProductsFilterForm';
import ProductsTable from '../../components/ProductsChooser/ProductTable';
import EditProduct from "../../components/EditProduct";
import Modal from 'react-modal';
import CheckLogin from "../../components/CheckLogin";
import Swal from 'sweetalert2';

class Products extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filterParams: {},
      showEditProductModal: false,
      editProductData: {}
    };
  }

  handleSearch = (filterParams) => {
    this.setState({ filterParams });
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

  handleProductEditSuccess = (updatedProduct) => {
    this.closeEditProductModal();
    Swal.mixin({
      toast: true,
      position: "center",
      showConfirmButton: false,
      timer: 3000
    }).fire({
      type: 'success',
      title: 'Product Edited Successfully'
    });
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
            style={{
              content: {
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                maxWidth: '800px',
                maxHeight: '90vh',
                overflow: 'auto'
              }
            }}
          >
            <EditProduct
              product={this.state.editProductData}
              callback={this.handleProductEditSuccess}
            />
          </Modal>

          <div className="container-fluid">
            <div className="row mt-4">
              <div className="col-md-3">
                <ProductsFilterForm onSearchBtnClick={this.handleSearch} />
              </div>

              <div className="col-md-9">
                <ProductsTable 
                  filterParams={this.state.filterParams} 
                  onEditProduct={this.handleEditProduct}
                />
              </div>
            </div>
          </div>
        </CheckLogin>
      </div>
    );
  }

}

export default Products;