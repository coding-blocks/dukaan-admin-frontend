import React from 'react';
import ChipList from "./ChipList";
import ToolTip from './ToolTip';
import Button from "@material-ui/core/Button"
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';

function ProductCard({detail: productType, handleModifyProducts, products}) {

    let productList = []
    if (products && !productType.applicable_all) {
        productList = products.map((p) => p.name)
    }
    const ButtonText = productList.length > 0 ? 'Edit' : 'Add'
    const addIcon = <AddIcon/>
    const editIcon = <EditIcon/>

    return (
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4 card-title">
                <h5 className="bold flex-1">Applicable {productType.product_type_name}</h5>
                {!productType.applicable_all ?
                    <Button
                        onClick={() => {
                            handleModifyProducts(productType.product_type_id)
                        }}
                        color="primary"
                        startIcon={ButtonText === 'Add' ? addIcon : editIcon}>
                        {`${ButtonText} ${productType.product_type_name}`}
                    </Button>
                    : <div/>
                }
            </div>
            {productType.applicable_all ?
                <ToolTip title={`This coupon is applicable on all ${productType.product_type_name} products`}/>
                : <ChipList productList={productList} limit={6}/>}

            {!productType.applicable_all ?
                <div className="font-mds orange mt-3 px-md-6 px-5">
                    <Button
                        onClick={() => {
                            handleModifyProducts(productType.product_type_id)
                        }}
                        color="primary">
                        View all {productType.product_type_name}
                    </Button>
                </div>
                : <div/>
            }
        </div>
    )
}

ProductCard.propTypes = {
    detail: PropTypes.object
}

export default ProductCard;
