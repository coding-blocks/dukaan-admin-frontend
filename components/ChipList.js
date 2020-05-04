import React from 'react';
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";
import Divider from '@material-ui/core/Divider';

function ChipList({productList, limit}) {
    return (
        <div>
            <Divider />
            <div className="my-4 py-2 row no-gutters px-md-5 px-4">
                {productList.slice(0, limit).map((pill) => {
                    return (<div className="mb-4 mr-4 normal chip">
                        <Chip
                            label={pill}
                            variant="outlined"
                        />
                    </div>)
                })}
            </div>
            <Divider/>
        </div>
    )
}

ChipList.prototype = {
    limit:PropTypes.number,
    productList:PropTypes.array
}

export default ChipList;