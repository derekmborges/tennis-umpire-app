import {
    Box,
    CircularProgress,
    IconButton,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material'
import React, { useState } from 'react'
import { Match, MatchStatus, MatchType } from '../../lib/types';
import { useDatabase } from '../../providers/databaseProvider';
import { useMatchManager } from '../../providers/matchManager'
import { MatchTypeSelect } from '../MatchTypeSelect';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DeleteMatchDialog } from './DeleteMatchDialog';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const statusLabelMap = new Map<MatchStatus, string>([
    [MatchStatus.PENDING_START, "Pending Start"],
    [MatchStatus.IN_PROGRESS, "In Progress"],
    [MatchStatus.COMPLETE, "Complete"],
])

export const MatchList = () => {
    const [selectingType, setSelectingType] = useState<boolean>(false)
    const { loading, matches, handleDelete } = useDatabase()
    const { handleNewMatch, handleLoadMatch } = useMatchManager()

    // Delete stuff
    const [matchToDelete, setMatchToDelete] = useState<Match | null>(null)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null)

    const incompleteMatches = matches?.filter(match => match.status < MatchStatus.COMPLETE)
    const completeMatches = matches?.filter(match => match.status === MatchStatus.COMPLETE)

    const newMatch = (type: MatchType) => {
        handleNewMatch(type)
    }

    const deleteMatch = () => {
        if (matchToDelete) {
            handleDelete(matchToDelete)
            setMatchToDelete(null)
            setDeleteSuccess(true)
        }
    }

    const MatchTable = (
        { title, matchList, addAction }: {
            title: string
            matchList: Match[]
            addAction?: boolean
        }
    ): JSX.Element => {
        return (
            <Paper sx={{ width: '100%', mt: 2, mb: 2 }}>
                <Toolbar sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 }
                }}>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {title}
                    </Typography>
                    {addAction && (
                        <Tooltip title="New Match">
                            <IconButton
                                color='default'
                                onClick={() => setSelectingType(true)}
                            >
                                <AddRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Toolbar>
                <TableContainer>
                    <Table aria-label="matches table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Matchup</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {matchList.map((match) => (
                                <TableRow
                                    key={match.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {match.player1.name} v. {match.player2.name}
                                    </TableCell>
                                    <TableCell>{match.type}</TableCell>
                                    <TableCell>{statusLabelMap.get(match.status)}</TableCell>
                                    <TableCell align="center">
                                        <Box>
                                            {match.status < MatchStatus.COMPLETE ? (
                                                <Tooltip title='Resume'>
                                                    <IconButton size='small' color='primary'
                                                        onClick={() => handleLoadMatch(match)}
                                                    >
                                                        <PlayArrowRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title='Results'>
                                                    <IconButton size='small' color='success'
                                                        onClick={() => handleLoadMatch(match)}
                                                    >
                                                        <SportsScoreIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {match.id !== undefined && (
                                                <Tooltip title='Delete'>
                                                    <IconButton size='small' color='error'
                                                        onClick={() => setMatchToDelete(match)}
                                                    >
                                                        <DeleteRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {matchList.length === 0 && (
                    <Typography variant='h6' p={2} width='100%' textAlign='center'>
                        No matches to display
                    </Typography>
                )}
            </Paper>
        )
    }

    return (
        <>
            <Typography variant='h3' padding={2}>
                Match Manager
            </Typography>

            {loading && (
                <Box display='flex' justifyContent='center'>
                    <CircularProgress />
                </Box>
            )}

            {!loading && incompleteMatches &&
                <MatchTable
                    addAction
                    matchList={incompleteMatches}
                    title='Current Matches'
                />
            }

            {!loading && completeMatches &&
                <MatchTable
                    matchList={completeMatches}
                    title='Complete Matches'
                />
            }

            {selectingType &&
                <MatchTypeSelect
                    onCancel={() => setSelectingType(false)}
                    onOk={newMatch}
                />
            }

            {matchToDelete &&
                <DeleteMatchDialog
                    match={matchToDelete}
                    onCancel={() => setMatchToDelete(null)}
                    onDelete={deleteMatch}
                />
            }

            {deleteSuccess &&
                <Snackbar
                    open
                    autoHideDuration={5000}
                    onClose={() => setDeleteSuccess(null)}
                    message="Match deleted"
                />
            }
        </>
    )
}
