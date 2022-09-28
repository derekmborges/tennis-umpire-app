import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import React from 'react'
import { Match } from '../../lib/types';

type Props = {
    match: Match;
    onCancel: () => void;
    onDelete: () => void;
}

export const DeleteMatchDialog = ({
    match,
    onCancel,
    onDelete
}: Props) => {

    const handleDelete = () => {
        onDelete()
    }

    return (
        <Dialog
            open
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Delete Match?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You are about to delete match "{match.player1.name} v. {match.player2.name}".
                    This cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={handleDelete} color='error' autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
}
