import { Button, Snackbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MatchStatus } from '../../lib/types'
import { useMatchManager } from '../../providers/matchManager'
import { CourtCard } from './CourtCard'
import { MatchScore } from './MatchScore'
import { MatchTimer } from './MatchTimer'
import { PointActions } from './PointActions'

export const MatchManager = () => {
  const { matchStatus, handleStartMatch } = useMatchManager()
  const [matchStarted, setMatchStarted] = useState<boolean | null>(null)

  const startMatch = () => {
    handleStartMatch()
    setMatchStarted(true)
  }

  return (
    <>
      <Typography variant="h5" component="div" p={2}>
        Match Manager
      </Typography>

      <MatchTimer />

      <MatchScore />

      <Typography variant="h6" p={2}>
        Court
      </Typography>

      <CourtCard />

      {matchStatus === MatchStatus.IN_PROGRESS ? (
        <>
          <Typography variant="h6" textAlign='center'
            mt={2} p={2}>
            Point Results
          </Typography>

          <PointActions />
        </>
      ) : (
        <Button
          variant='outlined'
          size='large'
          sx={{ m: 10 }}
          onClick={startMatch}
        >
          Start Match
        </Button>
      )}

      {matchStarted && (
        <Snackbar
          open
          autoHideDuration={5000}
          onClose={() => setMatchStarted(null)}
          message="Match started"
        />
      )}

    </>
  )
}
