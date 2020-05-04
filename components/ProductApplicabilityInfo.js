import React from 'react';
import ProductCard from './ProductCard';
import PropTypes from 'prop-types';

function ProductApplicabilityInfo({productDetails}) {
    return (
        <div>
            <div className={"col-md-11 mt-5 mb-3"}>
                {productDetails.map((productDetail) => {
                    return (
                        <div>
                            <div className="border-card px-0 py-6">
                                <ProductCard detail={productDetail}/>
                            </div>
                            <br/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

ProductApplicabilityInfo.prototype = {
    productDetails:PropTypes.object
};

export default ProductApplicabilityInfo;