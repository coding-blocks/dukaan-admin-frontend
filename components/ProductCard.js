import React from 'react';
import ChipList from "./ChipList";
import ToolTip from './ToolTip';
import Button from "@material-ui/core/Button"
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';

function ProductCard({detail: productType}) {

    let productList = []
    if (!productType.applicable_all) {
        productList = productType.products.map((p) => p.name)
    }
    const ButtonText = productList.length > 0 ? 'Edit' : 'Add'

    return (
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4 card-title">
                <h5 className="bold flex-1">Applicable {productType.name}</h5>
                {!productType.applicable_all ?
                    <Button
                        color="primary"
                        startIcon={ButtonText === 'Add' ? <AddIcon/> : <EditIcon/>}>
                        {`${ButtonText} ${productType.name}`}
                    </Button>
                    : <div/>
                }
            </div>
            {productType.applicable_all ?
                <ToolTip title={`This coupon is applicable on all ${productType.name} products`}/>
                : <ChipList productList={productList} limit={6}/>}

            <div className="font-mds orange mt-3 px-md-6 px-5">
                <Button
                    color="primary">
                    View all {productType.name}
                </Button>
            </div>
        </div>
    )
}

ProductCard.propTypes = {
    detail: PropTypes.object
}

export default ProductCard;
