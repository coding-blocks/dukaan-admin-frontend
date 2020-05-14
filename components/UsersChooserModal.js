import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UsersChooser from "./UsersChooser";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';

function UsersChooserModal(props) {

    return (
        <div>
            <Dialog
                open={props.isModalOpen}
                onClose={props.handleModalClose}
                modal={true}
                maxWidth={"xl"}
            >
                <DialogTitle>
                    Add Users
                    <IconButton style={{float: 'right', padding: '5px'}} onClick={props.handleModalClose}>
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <DialogContentText>
                        Please select users from their Email
                    </DialogContentText>

                    <UsersChooser
                        preFilledUsers={props.preFilledUsers}
                        handleNewSelectedUser={props.handleNewSelectedUser}
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={props.handleOnSaveChanges}>Save Changes</Button>
                    <Button onClick={props.handleModalClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UsersChooserModal