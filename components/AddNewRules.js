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

const validationSchema = Yup.object().shape({
    description: Yup.string().min(3, "Too Short").required("Required"),
    subCategory: Yup.string().min(3, "Too Short").required("Required"),
    category: Yup.string().required('Required')
})

class AddNewRules extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            subCategoryRules: [],
            isSuccess: false,
            isFailure: false
        }
    }

    // TODO
    // product types
    componentDidMount() {
        getProductTypes().then((response) => {
            const rules = response.data

            const data = rules.map((rule) => {
                return {
                    product_type_id: rule.id,
                    name: rule.name,
                    applicable_all: false
                }
            })

            this.setState({subCategoryRules: data})

        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    onSubmitAdd = (values,{resetForm}) => {
        const data = {
            category: values.category,
            name: values.subCategory,
            description: values.description,
            rules: values.subCategoryRules.map(({product_type_id, applicable_all}) => {
                return {
                    product_type_id,
                    applicable_all
                }
            })
        }

        addSubCategoryRules(data).then((response) => {
            this.setState({isSuccess: true})
            resetForm()
        }).catch((error) => {
            this.setState({isFailure: true})
        })
    }

    handleSuccessSnackBarClose = () => {
        this.setState({
            isSuccess: false,
        })
    }

    handleFailureSnackBarClose = () =>{
        this.setState({
            isFailure:false
        })
    }

    render() {
        return (
            <div>
                <div style={{position: 'fixed', bottom: '50px', right: '50px'}}>
                    <Fab color="secondary" aria-label="add" onClick={() => this.setState({isOpen: true})}>
                        <AddIcon/>
                    </Fab>
                </div>

                <Snackbar open={this.state.isSuccess} autoHideDuration={3000} onClose={this.handleSuccessSnackBarClose}>
                    <Alert severity="success" variant="filled">
                        New Sub-Category Added!
                    </Alert>
                </Snackbar>

                <Snackbar open={this.state.isFailure} autoHideDuration={3000} onClose={this.handleFailureSnackBarClose}>
                    <Alert severity='error' variant="filled">
                        Invalid Input!
                    </Alert>
                </Snackbar>

                <Dialog open={this.state.isOpen} onClose={() => this.setState({isOpen: false})}>
                    <DialogTitle>Add New Subcategory</DialogTitle>

                    <Formik onSubmit={this.onSubmitAdd} initialValues={{
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
                                            <FormControl variant="filled"
                                                         style={{minWidth: '220px'}}>
                                                <InputLabel required id="category-input-required">Category</InputLabel>
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
                                                required
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
                                                required
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
                                                {values.subCategoryRules.map((rule, index) => {
                                                    return (
                                                        <div className="mt-3 row" key={rule.product_type_id}>
                                                            <div className="col-md-9"
                                                                 style={{display: 'flex', alignItems: 'center'}}>
                                                                <span
                                                                    className={"text"}> Applicable on all {rule.name} ?</span>
                                                            </div>
                                                            <div className="element col-md-3">
                                                                <FormControlLabel
                                                                    key={rule.product_type_id}
                                                                    name={`subCategoryRules.${index}.applicable_all`}
                                                                    value={rule.applicable_all}
                                                                    control={<Switch color="primary"/>}
                                                                    label={rule.applicable_all ? "YES" : "NO"}
                                                                    labelPlacement="end"
                                                                    checked={rule.applicable_all}
                                                                    onChange={() => {
                                                                        setFieldValue(`subCategoryRules.${index}.applicable_all`, !rule.applicable_all)
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
                                            <Button onClick={() => this.setState({isOpen: false})} color="primary">
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

export default AddNewRules;