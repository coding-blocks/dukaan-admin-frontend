import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {addSubCategoryRules, getProductTypes} from "../controllers/v2/couponsV2";
import {error} from "next/dist/build/output/log";
import ErrorHandler from "../helpers/ErrorHandler";

class AddNewRules extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
            subCategory: '',
            open: false,
            startDate: new Date("2020-03-07T03:53"),
            endDate: new Date("2020-05-07T12:23"),
            description:'',
            subCategoryRules: []
        }
    }

    // TODO
    // product types
    componentDidMount(){
        getProductTypes().then((response)=>{
            this.setState({subCategoryRules:response.data})
        }).catch((error)=>{
            ErrorHandler.handle(error)
        })
    }

    onSubmitAdd = () => {
        const data = {
            category:this.state.category,
            name:this.state.subCategory,
            description: this.state.description,
            rules:this.state.subCategoryRules.map(({id,applicable_all})=>{
                return {
                    product_type_id:id,
                    applicable_all: applicable_all==undefined ? false : applicable_all
                }
            })
        }

        addSubCategoryRules(data).then((response)=>{
            console.log("Success!") // add Sweet Alert
        }).catch((error)=>{
            console.log("Failure!")
        })

        this.setState({
            open: false,
            category:'',
            subCategory:'',
            description:''
        })
    }

    render() {
        return (
            <div>
                <div style={{position: 'fixed', bottom: '50px', right: '50px'}}>
                    <Fab color="secondary" aria-label="add" onClick={() => this.setState({open: true})}>
                        <AddIcon/>
                    </Fab>
                </div>
                <Dialog open={this.state.open} onClose={() => this.setState({open: false})} >
                    <DialogTitle>Add New Subcategory</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Select category and input subcategory
                        </DialogContentText>
                        <div>
                            <FormControl required variant="filled" style={{minWidth: '220px'}}>
                                <InputLabel id="category-input-required">Category</InputLabel>
                                <Select
                                    value={this.state.category}
                                    onChange={(e) => this.setState({category: e.target.value})}
                                    inputProps={{
                                        id: "category-input-required"
                                    }}
                                >
                                    {this.props.categories.map((category, index) => {
                                        return (
                                            <MenuItem value={category} key={index}>
                                                {category}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>

                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="subCategory"
                                label="Sub-Category"
                                fullWidth
                                value={this.state.subCategory}
                                onChange={(e) => this.setState({subCategory: e.target.value})}
                            />

                            <TextField
                                required
                                autoFocus
                                margin="dense"
                                id="description"
                                label="Description"
                                fullWidth
                                value={this.state.description}
                                onChange={(e) => this.setState({description: e.target.value})}
                            />

                        </div>

                        {/*<div className="mt-4 mb-4 pr-1 pl-1">*/}
                        {/*    <MuiPickersUtilsProvider utils={DateFnsUtils}>*/}
                        {/*        <KeyboardDateTimePicker*/}
                        {/*            value={this.state.startDate}*/}
                        {/*            onChange={(date) => this.setState({startDate: date})}*/}
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
                        {/*            value={this.state.endDate}*/}
                        {/*            onChange={(date) => this.setState({endDate: date})}*/}
                        {/*            label="End Date"*/}
                        {/*            onError={console.log}*/}
                        {/*            minDate={new Date("2018-01-01T00:00")}*/}
                        {/*            format="yyyy/MM/dd hh:mm a"*/}
                        {/*        />*/}
                        {/*    </MuiPickersUtilsProvider>*/}
                        {/*</div>*/}

                        <div>
                            <div className="pb-3">
                                {this.state.subCategoryRules.map((rule) => {
                                    return (
                                        <div className="mt-3 row">
                                            <div className="col-md-9">
                                                <span
                                                    className={"text"}> Applicable on all {rule.name.toUpperCase()} ?</span>
                                            </div>
                                            <div className="element col-md-3" style={{display: 'flex'}}>
                                                <FormControlLabel
                                                    key={rule.id}
                                                    value={rule.applicable_all}
                                                    control={<Switch color="primary"/>}
                                                    label={rule.applicable_all ? "YES" : "NO"}
                                                    labelPlacement="end"
                                                    checked={rule.applicable_all}
                                                    onChange={() => {
                                                        this.setState(prevState => ({
                                                            subCategoryRules: prevState.subCategoryRules.map(
                                                                obj => (obj.id === rule.id ? Object.assign(obj, {applicable_all: !rule.applicable_all}) : obj)
                                                            )
                                                        }))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </DialogContent>

                    <div>
                        <DialogActions>
                            <Button onClick={() => this.setState({open: false})} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.onSubmitAdd} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
            </div>
        )
    }
}

export default AddNewRules;