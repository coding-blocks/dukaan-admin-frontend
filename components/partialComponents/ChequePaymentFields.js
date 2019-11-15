import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from "moment";
import FieldWithElement from "../FieldWithElement";

const getMinMaxDateRange = () => {
    return {
        max: moment.format('YYYY-MM-DD')
    }
}

const ChequeFields = ({chequeLocation, serialNumber, bankName, branchName, issueDate}) => {
    return (
        <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Location"
                    name={"chequeLocation"}
                    value={chequeLocation}/>
            </FieldWithElement>

            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"Serial Number"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Serial Number"
                    name={"serialNumber"}
                    value={serialNumber}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Bank Name"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Bank Name"
                    name={"bank"}
                    value={bankName}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Branch Name"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Branch Name"
                    name={"branch"}
                    value={branchName}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
                <input
                    type="date"
                    className={"input-text"}
                    max = {getMinMaxDateRange().max}
                    placeholder="Select Date"
                    name={"issueDate"}
                    value={issueDate}/>
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default ChequeFields
