import React from 'react';
import ProductCard from './ProductCard';
import PropTypes from 'prop-types';

function ProductApplicabilityInfo({productDetails, handleModifyProducts}) {
    return (
        <div>
            <div className={"col-md-11 mt-5 mb-3"}>
                {productDetails.map((productDetail) => {
                    return (
                        <div
                            key={productDetail.product_type_id}>
                            <div className="border-card px-0 py-6">
                                <ProductCard detail={productDetail}

                                             handleModifyProducts={handleModifyProducts}/>
                            </div>
                            <br/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

ProductApplicabilityInfo.propTypes = {
    productDetails:PropTypes.array
}

export default ProductApplicabilityInfo;
