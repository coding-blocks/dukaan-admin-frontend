import React from 'react';
import ProductCard from './ProductCard';

class ProductInfo extends React.Component {
    render() {
        return (
            <div>
                <div className={"col-md-11 mt-5 mb-3"}>
                    <div className="border-card px-0 py-6">
                        <ProductCard title="Products"/>
                    </div>
                    <br/>
                    <div className="border-card px-0 py-6">
                        <ProductCard title="Extensions"/>
                    </div>
                    <br/>
                    <div className="border-card px-0 py-6">
                        <ProductCard title="Books"/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductInfo;