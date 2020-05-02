import React from 'react';
import ChipList from "./ChipList";
import Status from './Status';

function ProductCard({detail}){

    const title = detail.type;

    return(
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4">
                <h5 className="bold flex-1">Applicable {title}</h5>
                <a href="#">
                    <h6>+ Add {title}</h6>
                </a>
            </div>
            <Status title={title} tollTip = {detail.applicaleRule} />
            <ChipList productList = {detail.productList} />
        </div>
    )
}

export default ProductCard;