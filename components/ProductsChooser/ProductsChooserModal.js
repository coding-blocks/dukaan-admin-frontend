import React from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import ProductsChooserV2 from "./ProductsChooserV2";
import PropTypes from "prop-types";


const ProductsChooserModal = (props) => {
    return (
        <Dialog
            title="Dialog"
            modal={true}
            maxWidth={"xl"}
            open={props.isModalOpen}
            onClose={props.handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description">
            <DialogContent>
                <ProductsChooserV2
                    preFilledProducts={props.preFilledProducts}
                    onProductsSelected={(productTypeId, selectedProducts) => {
                        props.onProductsSelected(productTypeId, selectedProducts)
                        props.handleCloseModal()
                    }}
                    productTypeId={props.productTypeId}
                    organizationId={props.organizationId}/>
            </DialogContent>
        </Dialog>
    )
}

ProductsChooserModal.propTypes = {
    preFilledProducts: PropTypes.any,
    productTypeId: PropTypes.number.isRequired,
    organizationId: PropTypes.number.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    onProductsSelected: PropTypes.func.isRequired,
    handleCloseModal: PropTypes.func.isRequired
}
export default ProductsChooserModal
