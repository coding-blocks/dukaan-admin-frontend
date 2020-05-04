import React from 'react';
import ChipList from "./ChipList";
import ToolTip from './ToolTip';
import PropTypes from 'prop-types';

function ProductCard({detail}){

    const title = detail.type;

    return(
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4 card-title">
                <h5 className="bold flex-1">Applicable {title}</h5>
                <a href="#">
                    <h6 className="orange" >+ Add {title}</h6>
                </a>
            </div>
            { detail.applicaleRule ? <ToolTip title={title}/> : false}
            { !detail.applicaleRule ? <ChipList productList = {detail.productList} limit = {6} /> : false}

            <a href="#">
                <div className="font-mds orange mt-3 px-md-6 px-5">View all</div>
            </a>
        </div>
    )
}

ProductCard.prototype = {
    detail:PropTypes.object
};

export default ProductCard;