import React from 'react';

function Status({title,tollTip}){
    if(tollTip) {
        return (
            <div className="bg-grey my-4 py-4 px-md-5 px-4">
                <h5 className="orange"><i className="fas fa-info mr-4"></i>This coupon is applicable on all the {title}
                </h5>
            </div>
        )
    }else{
        return false;
    }
}

export default Status;