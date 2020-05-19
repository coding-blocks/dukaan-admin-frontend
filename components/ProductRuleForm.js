import React, {useEffect, useState} from "react";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';

function ProductRuleForm({rule, onSaveChange}) {

    const [rules, setRules] = useState(rule)
    const [editButton, setEditButton] = useState(false)

    useEffect(()=>{
        setRules(rule)
    },[rule])

    const handleClick = (event) => {
        setEditButton(false)
        onSaveChange(rules)
    }

    return (
        <div>
            <div style={{display: "flex", justifyContent: 'flex-end'}}>
                <Button variant="outlined" disabled={editButton} onClick={()=>setEditButton(true)}
                        startIcon={<EditIcon fontSize="large" />}
                >
                    Edit
                </Button>
            </div>

            <div className={"pb-3"}>
                {rules.map((rule) => {
                    return (
                        <div className="mt-3 row" key={rule.id}>
                            <div className="col-md-9" style={{display:'flex',alignItems:'center'}} >
                                <span className={"text"}> Applicable on all {rule.product_type_name.toUpperCase()} ?</span>
                            </div>
                            <div className="col-md-3">
                                <FormControlLabel
                                    key={rule.id}
                                    value={rule.applicable_all}
                                    control={<Switch color="primary"/>}
                                    label={rule.applicable_all ? "YES" : "NO"}
                                    labelPlacement="end"
                                    checked={rule.applicable_all}
                                    disabled={!editButton}
                                    onChange={() => {
                                        setRules([...rules].map(object => {
                                            if (object.id == rule.id) {
                                                return {
                                                    ...object,
                                                    applicable_all: !rule.applicable_all
                                                }
                                            } else return object
                                        }))
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-5 pt-5">
                <Button color="primary" variant="contained" onClick={handleClick}>
                    Save Changes
                </Button>
            </div>
        </div>
    )
}

export default ProductRuleForm;