import React, {useState} from "react";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";

function CouponEdit(props) {
    const [startDate, handleStartDateChange] = useState(new Date("2020-03-07T03:53"));
    const [endDate, handleEndDateChange] = useState(new Date("2020-05-07T12:23"));

    return (
        <div className="offset-1">
            <div className="mt-4 mb-4 pr-1 pl-1">
                <FormControl required variant="filled" style={{minWidth: '220px'}}>
                    <InputLabel id="category-input-required">Category</InputLabel>
                    <Select
                        value={props.data.category}
                        onChange={props.handleCategoryChange}
                        inputProps={{
                            id: "category-input-required"
                        }}
                    >
                        {props.data.categories.map((category, index) => {
                            return (
                                <MenuItem value={category} key={index}>
                                    {category}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>
            <div className="mt-4 mb-4 pr-1 pl-1">
                <FormControl required
                             style={{minWidth: '220px'}} variant="filled">
                    <InputLabel id="subcategory-input-required">Sub-Category</InputLabel>
                    <Select
                        value={props.data.subCategory}
                        onChange={props.handleSubCategoryChange}
                        inputProps={{
                            id: "subcategory-input-required"
                        }}
                    >
                        {props.data.subCategories.map((subCategory) => {
                            return (
                                <MenuItem value={subCategory.id} key={subCategory.id}>
                                    {subCategory.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>

            {/*<div className="mt-4 mb-4 pr-1 pl-1">*/}
            {/*    <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
            {/*        <KeyboardDateTimePicker*/}
            {/*            value={startDate}*/}
            {/*            onChange={handleStartDateChange}*/}
            {/*            label="Start Date"*/}
            {/*            onError={console.log}*/}
            {/*            minDate={new Date("2018-01-01T00:00")}*/}
            {/*            format="yyyy/MM/dd hh:mm a"*/}
            {/*        />*/}
            {/*    </MuiPickersUtilsProvider>*/}
            {/*</div>*/}

            {/*<div className="mt-4 mb-4 pr-1 pl-1">*/}
            {/*    <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
            {/*        <KeyboardDateTimePicker*/}
            {/*            value={endDate}*/}
            {/*            onChange={handleEndDateChange}*/}
            {/*            label="End Date"*/}
            {/*            onError={console.log}*/}
            {/*            minDate={new Date("2018-01-01T00:00")}*/}
            {/*            format="yyyy/MM/dd hh:mm a"*/}
            {/*        />*/}
            {/*    </MuiPickersUtilsProvider>*/}
            {/*</div>*/}

        </div>
    );

}

export default CouponEdit;