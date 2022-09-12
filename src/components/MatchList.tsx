import { Button, Typography } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../providers/matchManager'

export const MatchList = () => {
    const { handleNewMatch } = useMatchManager()

    return (
        <>
            <Typography variant='h3' padding={2}>
                Match List
            </Typography>
            <Button
                sx={{ mt: 4 }}
                size='large'
                variant='contained'
                color='secondary'
                onClick={handleNewMatch}
            >
                Create Match
            </Button>
        </>
    )
}
