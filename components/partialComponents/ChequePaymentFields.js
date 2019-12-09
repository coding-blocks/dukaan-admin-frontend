import React from 'react';
import ReactDOM from 'react-dom';
import * as moment from "moment";
import FieldWithElement from "../FieldWithElement";

const getMinMaxDateRange = (min) => {
    if (min) {
        return {
            max: moment().format('YYYY-MM-DD'),
            min: moment().subtract(min, 'd').format('YYYY-MM-DD')
        }
    } else {
        return {
            max: moment().format('YYYY-MM-DD'),
            min: moment().subtract(85, 'd').format('YYYY-MM-DD')
        }
    }

}

const ChequeFields = ({chequeLocation, serialNumber, bankName, branchName, issueDate, onChange, minDate}) => {
    return (
        <div>
            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"Serial Number"}>
                <input
                    type="text"
                    maxLength="6"
                    className={"input-text"}
                    onChange={onChange}
                    placeholder="Enter Serial Number"
                    name={"serialNumber"}
                    value={serialNumber}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Bank Name"}>
                <input
                    type="text"
                    className={"input-text"}
                    onChange={onChange}
                    placeholder="Enter Your Bank Name"
                    name={"chequeBank"}
                    value={bankName}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Branch Name"}>
                <input
                    type="text"
                    className={"input-text"}
                    onChange={onChange}
                    placeholder="Enter Your Branch Name"
                    name={"branch"}
                    value={branchName}/>
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
                <input
                    type="date"
                    className={"input-text"}
                    min={getMinMaxDateRange(minDate).min}
                    onChange={onChange}
                    max={getMinMaxDateRange().max}
                    placeholder="Select Date"
                    name={"issueDate"}
                    value={issueDate}/>
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default ChequeFields
