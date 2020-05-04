import React from 'react';
import ChipList from "./ChipList";
import ToolTip from './ToolTip';
import Button from "@material-ui/core/Button"
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';

function ProductCard({detail}){

    const title = detail.type

    return(
        <div>
            <div className="row no-gutters justify-content-between align-items-center px-md-5 px-4 card-title">
                <h5 className="bold flex-1">Applicable {title}</h5>
                    <Button
                        color="primary"
                        startIcon={<AddIcon />}
                    >
                        Add {title}
                    </Button>
            </div>
            { detail.applicaleRule ? <ToolTip title={title}/> : <ChipList productList = {detail.productList} limit = {6} /> }

                <div className="font-mds orange mt-3 px-md-6 px-5">
                    <Button
                        color="primary">
                        View all {title}
                    </Button>
                </div>
        </div>
    )
}

ProductCard.propTypes = {
    detail:PropTypes.object
}

export default ProductCard;
