import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PropTypes from 'prop-types';

function ToolTip({title}) {
    return (
        <div className="bg-grey my-4 py-4 px-md-5 px-4">
            <div className="orange tool-tip"><InfoOutlinedIcon fontSize='large' className="mr-3"></InfoOutlinedIcon>
                <h5 className="tool-tip-title">
                    This coupon is applicable on all the {title}
                </h5>
            </div>
        </div>
    )
}

ToolTip.propTypes = {
    title: PropTypes.string
}

export default ToolTip;