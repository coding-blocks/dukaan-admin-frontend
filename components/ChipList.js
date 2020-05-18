import React from 'react';
import Chip from "@material-ui/core/Chip";
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';

function ChipList({productList, limit}) {
    return (
        <div>
            <Divider/>
            <div className="my-4 py-2 row no-gutters px-md-5 px-4">
                {productList.slice(0, limit).map((product) => {
                    return (<div className="mb-4 mr-4 normal chip"
                                 key={product}
                    >
                        <Chip
                            label={product}
                            variant="outlined"
                        />
                    </div>)
                })}
            </div>
            <Divider/>
        </div>
    )
}

ChipList.propTypes = {
    limit: PropTypes.number,
    productList: PropTypes.array
}

export default ChipList;
