import React from 'react'
import userController from "../controllers/users";
import ErrorHandler from "../helpers/ErrorHandler";
import {Autocomplete} from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';

class UsersChooser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: this.props.preFilledUsers ? this.props.preFilledUsers : [],
            usersSearchResult: []
        }
    }

    onSearchInputChange = (event) => {
        const inputValue = event.target.value
        if (inputValue.length > 3) {
            userController.handleGetUserByEmailOrPhone('email', inputValue).then((response) => {
                this.setState({usersSearchResult: response.data})
            }).catch((error => {
                ErrorHandler.handle(error)
            }))
        }
    }

    handleChange = (event, values) => {
        this.setState({
            selectedUsers: values,
            usersSearchResult:[]
        }, () => {
            this.props.handleNewSelectedUser(this.state.selectedUsers)
        })
    }

    render() {
        return (
            <div>
                <Autocomplete
                    style={{width: 800}}
                    multiple
                    autoComplete={true}
                    fullWidth={true}
                    filterSelectedOptions={true}
                    onChange={this.handleChange}
                    getOptionLabel={(option) => option.email}
                    options={this.state.usersSearchResult}
                    value={this.state.selectedUsers}
                    getOptionSelected={(option, value) => {
                        return option.email === value.email
                    }}

                    renderInput={(params) => (
                        <TextField
                            {...params}
                            onChange={this.onSearchInputChange}
                            variant="outlined"
                            label="User Email"
                            placeholder="Enter user..."
                        />
                    )}
                />
            </div>
        )
    }
}

export default UsersChooser