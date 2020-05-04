import React from 'react';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PropTypes from 'prop-types';

function ToolTip({title}) {
    return (
        <div className="bg-grey my-4 py-2 px-md-5 px-2">
            <div className="orange">
                <div className={"row"}>
                    <div className={"mt-2"}>
                        <InfoOutlinedIcon fontSize='large' className="mr-3"/>
                    </div>
                    <div>
                        <p>
                            This coupon is applicable on all the {title}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

ToolTip.propTypes = {
    title: PropTypes.string
}

export default ToolTip;
