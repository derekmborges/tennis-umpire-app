import { Box, Button } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../../providers/matchManager'

export const PointActions = () => {
    const {
        player1,
        player2,
        handlePoint
    } = useMatchManager()

    return player1 && player2 && (
        <Box sx={{ width: '100%' }} display='flex' justifyContent='center'>
            <Button
                variant='contained'
                color='success'
                size='large'
                sx={{ width: 200, m: 2 }}
                onClick={() => handlePoint(player1)}
            >
                Point <br />
                {player1.name}
            </Button>
            <Button
                variant='contained'
                color='success'
                size='large'
                sx={{ width: 200, m: 2 }}
                onClick={() => handlePoint(player2)}
            >
                Point <br />
                {player2.name}
            </Button>
        </Box>
    )
}
