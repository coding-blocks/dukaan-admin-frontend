import React from 'react';
import ProductCard from './ProductCard';

function ProductInfo({productDetail}){
        return (
            <div>
                <div className={"col-md-11 mt-5 mb-3"}>
                    <div className="border-card px-0 py-6">
                        <ProductCard detail ={productDetail[0]}/>
                    </div>
                    <br/>
                    <div className="border-card px-0 py-6">
                        <ProductCard detail={productDetail[1]}/>
                    </div>
                    <br/>
                    <div className="border-card px-0 py-6">
                        <ProductCard detail={productDetail[2]}/>
                    </div>
                </div>
            </div>
        )
}

export default ProductInfo;