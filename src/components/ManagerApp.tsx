import { Box, Button, Container, Fade, Typography } from '@mui/material'
import React from 'react'
import { MatchStatus } from '../lib/types'
import { useMatchManager } from '../providers/matchManager'
import { CreateMatch } from './CreateMatch'
import { MatchList } from './MatchList'
import { MatchManager } from './MatchManager'
import { MatchResult } from './MatchResult'

const statusMap = new Map<MatchStatus | null, JSX.Element>([
    [null, <MatchList />],
    [MatchStatus.CREATING, <CreateMatch />],
    [MatchStatus.IN_PROGRESS, <MatchManager />],
    [MatchStatus.COMPLETE, <MatchResult />]
])

export const ManagerApp = () => {
    const { matchStatus } = useMatchManager()

    return (
        <Container maxWidth="sm">
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {statusMap.get(matchStatus)}
            </Box>
        </Container>
    )
}
