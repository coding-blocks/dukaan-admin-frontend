import React from "react";
import ReactDOM from "react-dom";

const PrimaryAddress = ({primaryAddress, college, branch}) => {
    return (<div>
        <p>WhatsApp Number : {primaryAddress.whatsapp_number}</p>
        <p>Branch: {branch.name}</p>
        <p>College: {college.name}</p>
        <p>Address: {`${primaryAddress.street_address},${primaryAddress.landmark},${primaryAddress.city}`}</p>
    </div>)

};

export default PrimaryAddress;
