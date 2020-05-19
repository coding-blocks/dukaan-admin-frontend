import React from "react";
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import {PropTypes} from "@material-ui/core";
import * as controller from "../../../controllers/v2/couponsV2";
import {error} from "next/dist/build/output/log";
import ErrorHandler from "../../../helpers/ErrorHandler";
import ProductRuleForm from "../../../components/ProductRuleForm";
import CouponEdit from "../../../components/CouponEdit";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddNewRules from "../../../components/AddNewRules";

class AddCouponTypes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            organizations: [],
            categories: [],
            subCategories: [],
            subCategoryRules: [],
            formView: false,
            category: '',
            subCategory: ''
        }
    }

    componentDidMount() {
        controller.fetchAllCouponCategories().then((response) => {
            this.setState({
                categories: response.data
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    handleCategoryChange = (event) => {
        controller.fetchSubCategories({category: event.target.value}).then((response) => {
            this.setState({
                subCategories: response.data,
                category: event.target.value,
                subCategoryRules:[]
            })
        }).catch((error) => {
            ErrorHandler.handle(error)
        })
    }

    handleSubCategoryChange = (event) => {
        controller.fetchSubCategoryRules({id: event.target.value, category: this.state.category}).then((response) => {
            console.log(response.data)
            this.setState({
                subCategoryRules: response.data,
                formView: true,
                subCategory: event.target.value
            })

        }).then((error) => {
            ErrorHandler.handle(error)
        })
    }

    onSaveChange = (newRule) => {
        this.setState({
            subCategoryRules: newRule
        },()=> {
            //TODO
            //Rename to subcategoty ID
            const data = {
                category: this.state.category,
                id: Number(this.state.subCategory),
                rules: this.state.subCategoryRules.map(({product_type_id,applicable_all}) => {
                    return {
                        product_type_id,
                        applicable_all
                    }
                })
            }
            controller.editSubCategory(data)
        })
    }

    render() {
        return (
            <div>
                <Head title="Coding Blocks | Dukaan | Add Coupon Types"/>
                <Layout/>
                <div className="col-md-12">
                    <div className={"d-flex justify-content-center mt-1 pt-3 pb-1"}>
                        <h2 className={"title"}>Add Coupon Types</h2>
                    </div>
                    <div className="col-md-9">
                        <div className="border-card coupon-card col-md-12 offset-2 mt-5 mb-1" style={{display: 'flex'}}>

                            <CouponEdit data={this.state} handleCategoryChange={this.handleCategoryChange}
                                        handleSubCategoryChange={this.handleSubCategoryChange}/>

                            <div className="offset-1 pr-1 pl-1" style={{minWidth: '400px'}}>
                                {this.state.formView ? <ProductRuleForm rule={this.state.subCategoryRules}
                                                                        onSaveChange={this.onSaveChange}/> :
                                    <div></div>}
                            </div>
                        </div>
                    </div>

                    <AddNewRules categories={this.state.categories}/>

                </div>
            </div>
        );
    }
}

export default AddCouponTypes;