import { Box, Typography } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../../providers/matchManager'

export const MatchTimer = () => {
    const { matchTimerLabel } = useMatchManager()

  return (
    <Box width='100%' m={2}>
        <Typography textAlign='center' variant='body1'>
            Timer
        </Typography>
        <Typography
            variant='h3'
            textAlign='center'>
            {matchTimerLabel}
        </Typography>
    </Box>
  )
}
