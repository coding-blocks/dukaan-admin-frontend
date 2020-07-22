import React from 'react'
import Button from '@material-ui/core/Button';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import * as Yup from 'yup';
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';

const CustomCouponForm = ({handleAddCustomCoupon}) => {

    const initialValues = {
        percentage: '',
        expiration: ''
    }

    const admin_discount_limit = () => {
        const dukaanToken = Cookies.get("dukaan-token");
        const userInfo = jwt.decode(dukaanToken);
        return userInfo.data.admin_discount_limit
    } 

    const validationSchema = Yup.object().shape({
        percentage: Yup.number()
            .min(1, 'must be greater than 0')
            .max( admin_discount_limit() ? admin_discount_limit() : 100)
            .required('Discount is required'),
        expiration: Yup.number()
            .min(1).max(48)
            .required('Coupon Expiration is required')
    })

    const handleAddCoupon = (formFields) => {
        handleAddCustomCoupon(formFields)
    }

    return (

        <div>
            { !admin_discount_limit() 

                ?   <div className={"d-flex align-items-center justify-content-center red"}>
                        <b>*You dont have permission to add custom discount. *</b>
                    </div>
                    
                :   <Formik initialValues={initialValues} validationSchema={validationSchema}
                        onSubmit={handleAddCoupon}>

                        {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting
                                        , setFieldValue, setFieldTouched}) => (



                                    
                            <form onSubmit={handleSubmit}>
                                <div className={"col-md-12"}>

                                    

                                    <FormControl variant="outlined" size={"medium"}
                                        className={"col-md-8 mb-4 mt-3"}
                                        >
                                        <Tooltip title={<span className={"mui-tooltip"}>Discount as percentage</span>} 
                                            placement="bottom-end">

                                            <TextField name="percentage" 
                                                type="number"
                                                label="Discount"
                                                variant="outlined" 
                                                placeholder="Enter Discount in percentage"
                                                value={values.percentage}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                />

                                        </Tooltip>

                                        {errors.percentage && touched.percentage && <span className="red mt-2 ml-auto">
                                            {errors.percentage}
                                        </span>}

                                    </FormControl>

                                    <FormControl variant="outlined" size={"medium"}
                                        className={"col-md-8  mb-4"}>
                                        <Tooltip title={<span className={"mui-tooltip"}>Expiration in hours</span>} 
                                            placement="bottom-end">

                                            <TextField name="expiration" 
                                                type="number"
                                                label="Expiration"
                                                variant="outlined" 
                                                placeholder="Enter Expiration in hours"
                                                value={values.expiration}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                inputProps={{
                                                    maxLength: 4
                                                }}
                                                />
                                        </Tooltip>

                                        {errors.expiration && touched.expiration && <span className="red mt-2 ml-auto">
                                            {errors.expiration}
                                        </span>}

                                    </FormControl>


                                    <Grid container justify="center">
                                        <Button
                                            id="submitBtn" type="submit"
                                            style={{background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" , color: 'white', border: 0,
                                                borderRadius: 3, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'}}>
                                            Save 
                                        </Button>
                                    </Grid>

                                </div>
                            </form>
                    )}

                    </Formik>
                
            }      
        </div>     


        
    );
}

export default CustomCouponForm