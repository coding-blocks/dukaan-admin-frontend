import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function ConfirmationDialog({isOpen, onAgree, onDisagree}) {
    return (
        <div>
            <Dialog open={isOpen}
                    onClose={onDisagree}
            >
                <DialogTitle id="alert-dialog-title">Switch Organization?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have some unsaved changes switching will clear them.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onDisagree} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={onAgree} color="primary">
                        Clear
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ConfirmationDialog
