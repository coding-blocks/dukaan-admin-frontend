import React from 'react'
import Button from "@material-ui/core/Button"
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UsersChooserModal from "./UsersChooserModal";
import PropTypes from "prop-types";


class SelectedUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            selectedUsers: []
        }
    }

    handleModalOpen = () => {
        this.setState({isModalOpen: true})
    }

    handleModalClose = () => {
        this.setState({isModalOpen: false})
    }

    onUsersSelected = (selectedUsers) => {
        this.setState({selectedUsers})
    }

    handleOnSaveChanges = () => {
        this.setState({isModalOpen: false})
        this.props.onUsersSelected(this.state.selectedUsers)
    }

    render() {
        const ButtonText = this.props.preFilledUsers.length > 0 ? 'Edit' : 'Add'
        const addIcon = <AddIcon fontSize={"small"}/>
        const editIcon = <EditIcon fontSize={"small"}/>

        return (
            <div style={{paddingTop: '10px', paddingLeft: '10px'}}>
                <strong>{this.props.preFilledUsers.length} Users Selected</strong>
                <Button style={{float: 'right', padding: '0'}}
                        variant="outlined"
                        size={"small"}
                        startIcon={ButtonText === 'Add' ? addIcon : editIcon}
                        onClick={this.handleModalOpen}
                >
                    {ButtonText}
                </Button>

                <UsersChooserModal
                    preFilledUsers={this.state.selectedUsers}
                    isModalOpen={this.state.isModalOpen}
                    handleModalClose={this.handleModalClose}
                    onUsersSelected={this.onUsersSelected}
                    handleOnSaveChanges={this.handleOnSaveChanges}
                />

            </div>
        )
    }
}

export default SelectedUsers

SelectedUsers.propTypes={
    preFilledUsers:PropTypes.any,
    onUsersSelected:PropTypes.func.isRequired
}
