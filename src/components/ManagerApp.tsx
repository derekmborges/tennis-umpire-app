import { Box, Container, Fab } from '@mui/material'
import React from 'react'
import { MatchStatus } from '../lib/types'
import { useMatchManager } from '../providers/matchManager'
import { CreateMatch } from './CreateMatch'
import { MatchList } from './MatchList/MatchList'
import { MatchManager } from './MatchManager/MatchManager'
import { MatchResult } from './MatchResult'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export const ManagerApp = () => {
    const { matchStatus, handleCloseMatch } = useMatchManager()

    const statusMap = new Map<MatchStatus | null, JSX.Element>([
        [null, <MatchList />],
        [MatchStatus.CREATING, <CreateMatch />],
        [MatchStatus.PENDING_START, <MatchManager />],
        [MatchStatus.IN_PROGRESS, <MatchManager />],
        [MatchStatus.COMPLETE, <MatchResult />]
    ])

    return (
        <>
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

            { matchStatus && matchStatus > MatchStatus.CREATING && (
                <Fab
                    size='small'
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10
                    }}
                    onClick={handleCloseMatch}
                >
                    <CloseRoundedIcon />
                </Fab>
            )}
        </>
    )
}
