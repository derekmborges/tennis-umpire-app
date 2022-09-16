import { Box, Button } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../../providers/matchManager'

export const PointActions = () => {
    const {
        player1,
        player2,
    } = useMatchManager()

    return (
        <Box sx={{ width: '100%' }} display='flex' justifyContent='center'>
            <Button
                variant='contained'
                size='large'
                sx={{ m: 2 }}
            >
                Point <br />
                {player1?.name}
            </Button>
            <Button
                variant='contained'
                size='large'
                sx={{ m: 2 }}
            >
                Point <br />
                {player2?.name}
            </Button>
        </Box>
    )
}
