import React from 'react';
import ReactDOM from 'react-dom';
import FieldWithElement from "../FieldWithElement";
import * as moment from "moment";

const getMinMaxDateRange = () => {
    return {
        max: moment().format('YYYY-MM-DD'),
        min: moment().subtract(85, 'd').format('YYYY-MM-DD')
    }
}
const alphaOnly = (e)  =>{
    let key = e.keyCode;
    return ((key >= 65 && key <= 90) || key === 8);
};

const NeftFields = ({neftLocation, neftUTR, issueDate, neftBank, onChange}) => {
    return (
        <div>
            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"NEFT Transaction ID"}
            >
                <input
                    type="text"
                    className={"input-text"}
                    onChange={onChange}
                    placeholder="Enter Your Transaction ID"
                    name={"neftUtr"}
                    value={neftUTR}
                />
            </FieldWithElement>

            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"Bank"}
            >
                <input
                    type="text"
                    onKeyPress={alphaOnly}
                    className={"input-text"}
                    placeholder="Enter bank name"
                    name={"neftBank"}
                    onChange={onChange}
                    value={neftBank}
                />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"NEFT Date"}>
                <input
                    type="date"
                    min={getMinMaxDateRange().min}
                    max={getMinMaxDateRange().max}
                    className={"input-text"}
                    placeholder="Select Date"
                    onChange={onChange}
                    name={"neftDate"}
                    value={issueDate}
                />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default NeftFields
