import React from 'react';
import PillsList from "./PillsList";
import Status from './Status';

function ProductCard(props){
    return(
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4">
                <h4 className="bold flex-1">Applicable {props.title}</h4>
                <a href="#">
                    <h5>+ Add {props.title}</h5>
                </a>
            </div>
            <Status title={props.title} />
            <PillsList/>
        </div>
    )
}

export default ProductCard;