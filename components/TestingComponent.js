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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Alert from '@material-ui/lab/Alert';
// import {KeyboardDateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
import {addSubCategoryRules, getProductTypes} from "../controllers/v2/couponsV2";
import {error} from "next/dist/build/output/log";
import ErrorHandler from "../helpers/ErrorHandler";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';


const initialValues = {
    description: '',
    subCategory: '',
    category: ''
}

const validationSchema = Yup.object().shape({
    description: Yup.string().min(3, "Too Short!").required("Required!!!!!!"),
    subCategory: Yup.string().min(3, "Please Write a longer sub category").required("Required"),
    category: Yup.string().required('Category Required!')
})

class TestingComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            category: '',
            subCategory: '',
            open: false,
            description: '',
            subCategoryRules: new Map(),
            isSuccess: false,
            isFailure: false
        }
    }

    // TODO
    // product types
    componentDidMount() {
        getProductTypes().then((response) => {
            let rules = new Map()
            const {data} = response

            data.map((i) => {
                rules.set(i.id, {name: i.name, applicable_all: false})
            })

            console.log(rules)
            this.setState({subCategoryRules: rules})

        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    onSubmitAdd = () => {
        const data = {
            category: this.state.category,
            name: this.state.subCategory,
            description: this.state.description,
            rules: this.state.subCategoryRules.map(({id, applicable_all}) => {
                return {
                    product_type_id: id,
                    applicable_all: applicable_all == undefined ? false : applicable_all
                }
            })
        }

        addSubCategoryRules(data).then((response) => {
            console.log("Success!") // add Sweet Alert
            this.setState({isSuccess: true})
        }).catch((error) => {
            console.log("Failure!")
            this.setState({isFailure: true})
        })

    }

    handleSnackBarClose = () => {
        this.setState({
            isSuccess: false,
        })
    }

//     [
//         {
//         id,
//         rules: true/false
//         name
//         }
//         ,{
//
// },{
//
// }
//         ]
//
//     const obj = {
//         1:{
//             applicable_all:false,
//             name:'book'
//         },
//         2:{
//
//         },
//         3:{
//
//         }
//     }

    onSubmit = (values) => {
        console.log(values)
        console.log('Submitting Form')
        console.log(this.state.subCategoryRules)
    }

    handleSubCategoryRulesChange = (rule_id,currentRules) =>{
        currentRules.set(rule_id, {
            name:currentRules.get(rule_id).name,
            applicable_all:!currentRules.get(rule_id).applicable_all
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

                <Snackbar open={this.state.isSuccess} autoHideDuration={3000} onClose={this.handleSnackBarClose}>
                    <Alert onClose={this.handleSnackBarClose} severity="success" variant="filled">
                        New Sub-Category Added!
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.isFailure} autoHideDuration={3000} onClose={this.handleSnackBarClose}>
                    <Alert onClose={this.handleSnackBarClose} severity='error' variant="filled">
                        Invalid Input!
                    </Alert>
                </Snackbar>

                <Dialog open={this.state.open} onClose={() => this.setState({open: false})}>
                    <DialogTitle>Add New Subcategory</DialogTitle>

                    <Formik onSubmit={this.onSubmit} initialValues={{
                        description: '',
                        subCategory: '',
                        category: '',
                        subCategoryRules: this.state.subCategoryRules
                    }} validationSchema={validationSchema}>
                        {(props) => {
                            const {
                                values,
                                touched,
                                errors,
                                dirty,
                                isSubmitting,
                                setFieldValue,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                handleReset,
                            } = props;
                            return (
                                <form onSubmit={handleSubmit}>
                                    <DialogContent>
                                        <div>
                                            <FormControl required variant="filled" style={{minWidth: '220px'}}
                                                         onBlur={handleBlur}>
                                                <InputLabel id="category-input-required">Category</InputLabel>
                                                <Select
                                                    value={values.category}
                                                    onChange={handleChange('category')}
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
                                                autoComplete={"off"}
                                                label="Description"
                                                name="description"
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                margin={"normal"}
                                                fullWidth
                                                helperText={<ErrorMessage name="description"/>}
                                            />

                                            <TextField
                                                autoComplete="off"
                                                label="Sub-Category"
                                                name="subCategory"
                                                value={values.subCategory}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                fullWidth
                                                helperText={<ErrorMessage name="subCategory"/>}
                                            />

                                        </div>

                                        <div>
                                            <div className="pb-3">
                                                {[...values.subCategoryRules.keys()].map((rule_id) => {
                                                    return (
                                                        <div className="mt-3 row" key={rule_id}>
                                                            <div className="col-md-9"
                                                                 style={{display: 'flex', alignItems: 'center'}}>
                                                                <span
                                                                    className={"text"}> Applicable on all {values.subCategoryRules.get(rule_id).name.toUpperCase()} ?</span>
                                                            </div>
                                                            <div className="element col-md-3">
                                                                <FormControlLabel
                                                                    key={rule_id}
                                                                    name={values.subCategoryRules.get(rule_id).name}
                                                                    value={values.subCategoryRules.get(rule_id).applicable_all}
                                                                    control={<Switch color="primary"/>}
                                                                    label={values.subCategoryRules.get(rule_id).applicable_all ? "YES" : "NO"}
                                                                    labelPlacement="end"
                                                                    checked={values.subCategoryRules.get(rule_id).applicable_all}
                                                                    onChange={(event) => {
                                                                        // console.log('on Change Started!')
                                                                        setFieldValue(values.subCategoryRules.get(rule_id).name,!values.subCategoryRules.get(rule_id).applicable_all)
                                                                        console.log('on Change!')
                                                                        this.handleSubCategoryRulesChange(rule_id,values.subCategoryRules)
                                                                        console.log(values)
                                                                        // this.setState(prevState => ({
                                                                        //     subCategoryRules: prevState.subCategoryRules.map(
                                                                        //         obj => (obj.id === rule.id ? Object.assign(obj, {applicable_all: !rule.applicable_all}) : obj)
                                                                        //     )
                                                                        // }))
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
                                            <Button type="submit" color="primary">
                                                Add
                                            </Button>
                                        </DialogActions>
                                    </div>
                                </form>
                            )
                        }}
                    </Formik>

                </Dialog>
            </div>
        )
    }
}

export default TestingComponent;