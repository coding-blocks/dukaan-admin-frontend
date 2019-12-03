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

const SwipeFields = ({swipeLocation, swipeUTR, issueDate, swipeAppCode, onChange}) => {
    return (
        <div>
            <FieldWithElement nameCols={3} elementCols={9} name={"Location"}>
                <input
                    type="text"
                    className={"input-text"}
                    placeholder="Enter Your Location"
                    name={"swipeLocation"}
                    onChange={onChange}
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
                    onChange={onChange}
                    placeholder="Enter Your Swipe ID"
                    name={"swipeUtr"}
                    value={swipeUTR}
                />
            </FieldWithElement>

            <FieldWithElement
                nameCols={3}
                elementCols={9}
                name={"Swipe App Code"}
            >
                <input
                    type="text"
                    className={"input-text"}
                    onChange={onChange}
                    placeholder="Enter Swipe App Code"
                    name={"swipeAppCode"}
                    value={swipeAppCode}
                />
            </FieldWithElement>

            <FieldWithElement nameCols={3} elementCols={9} name={"Swipe Date"}>
                <input
                    type="date"
                    className={"input-text"}
                    placeholder="Select Date"
                    min={getMinMaxDateRange().min}
                    onChange={onChange}
                    max = {getMinMaxDateRange().max}
                    name={"swipeDate"}
                    value={issueDate}
                />
            </FieldWithElement>
            <div className="divider-h mb-5 mt-5"/>
        </div>
    )
}

export default SwipeFields
