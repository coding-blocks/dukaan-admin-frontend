import React from 'react';
import ReactDOM from 'react-dom';
import FieldWithElement from "../FieldWithElement";

const NeftFields = ({neftLocation, neftUTR, issueDate}) => {
    return (
        <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Location"
                    name={"neftLocation"}
                    value={neftLocation}
                />
            </FieldWithElement>

            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"NEFT Transaction ID"}
            >
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Transaction ID"
                    name={"neftUtr"}
                    value={neftUTR}
                />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
                <input
                    type="date"
                    className={"input-text"}
                    placeholder="Select Date"
                    name={"neftDate"}
                    value={issueDate}
                />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default NeftFields
