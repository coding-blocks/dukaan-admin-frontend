import React from 'react';

function Status(props){
    return(
        <div className="bg-grey my-4 py-4 px-md-5 px-4">
            <h5 className="orange"><i className="fas fa-info mr-4"></i>This coupon is applicable on all the {props.title}</h5>
        </div>
    )
}

export default Status;