import { Box, Button, Divider, Typography } from '@mui/material'
import React from 'react'
import { useMatchManager } from '../providers/matchManager'
import { MatchScore } from './MatchManager/MatchScore'

export const MatchResult = () => {
  const {
    matchWinner,
    handleCloseMatch,
    handleRematch
  } = useMatchManager()

  return (
    <Box
      width='100%'
      display='flex' flexDirection='column'
      justifyContent='center' alignItems='center'
      p={4}
    >
      <Typography variant='h3' textAlign='center'>
        The winner is:
      </Typography>
      <Typography variant='h2' textAlign='center'
        color='success.dark'
        // mb={4}
        p={4}
      >
        {matchWinner?.name}
      </Typography>
      
      <MatchScore />

      <Divider light sx={{ m: 5, width: '25%', height: '3px' }} />

      <Button
        size='large' variant='outlined'
        sx={{ width: 300, mb: 1 }}
        onClick={handleRematch}
      >
        Rematch
      </Button>
      <Button
        size='large' variant='contained'
        sx={{ width: 300 }}
        onClick={handleCloseMatch}
      >
        Close
      </Button>
    </Box>
  )
}
