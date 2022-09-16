import { AppBar, Box, Divider, Stack, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { CourtCard } from './CourtCard'
import { MatchScore } from './MatchScore'

export const MatchManager = () => {
  return (
    <>
      <Typography variant="h5" component="div" p={2}>
        Match Manager
      </Typography>

      <MatchScore />

      <Typography variant="h6" p={2}>
        Court
      </Typography>

      <CourtCard />

      <Typography variant="h6" mt={2} p={2}>
        Point Results
      </Typography>

      
    </>
  )
}
