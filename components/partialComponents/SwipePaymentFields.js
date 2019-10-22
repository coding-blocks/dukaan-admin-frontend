import React from 'react';
import ReactDOM from 'react-dom';
import FieldWithElement from "../FieldWithElement";

const SwipeFields = ({swipeLocation, swipeUTR, issueDate}) => {
    return (
        <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Location"
                    name={"swipeLocation"}
                    value={swipeLocation}
                />
            </FieldWithElement>

            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"SWIPE Transaction ID"}
            >
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Swipe ID"
                    name={"swipeUtr"}
                    value={swipeUTR}
                />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Issue Date"}>
                <input
                    type="date"
                    className={"input-text"}
                    placeholder="Select Date"
                    name={"swipeDate"}
                    value={issueDate}
                />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default SwipeFields
