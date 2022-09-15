import { Box, Container } from '@mui/material'
import React from 'react'
import { MatchStatus } from '../lib/types'
import { useMatchManager } from '../providers/matchManager'
import { CreateMatch } from './CreateMatch'
import { MatchList } from './MatchList'
import { MatchManager } from './MatchManager/MatchManager'
import { MatchResult } from './MatchResult'

export const ManagerApp = () => {
    const { matchStatus } = useMatchManager()

    const statusMap = new Map<MatchStatus | null, JSX.Element>([
        [null, <MatchList />],
        [MatchStatus.CREATING, <CreateMatch />],
        [MatchStatus.PENDING_START, <MatchManager />],
        [MatchStatus.IN_PROGRESS, <MatchManager />],
        [MatchStatus.COMPLETE, <MatchResult />]
    ])

    return (
        <Container maxWidth="md">
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
