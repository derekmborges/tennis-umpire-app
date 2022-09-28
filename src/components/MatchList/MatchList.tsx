import {
    Box,
    Button,
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
    Tooltip,
    Typography
} from '@mui/material'
import React, { useState } from 'react'
import { Match, MatchType } from '../../lib/types';
import { useDatabase } from '../../providers/databaseProvider';
import { useMatchManager } from '../../providers/matchManager'
import { MatchTypeSelect } from '../MatchTypeSelect';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { DeleteMatchDialog } from './DeleteMatchDialog';

export const MatchList = () => {
    const [selectingType, setSelectingType] = useState<boolean>(false)
    const { loading, matches, handleDelete } = useDatabase()
    const { handleNewMatch, handleLoadMatch } = useMatchManager()

    // Delete stuff
    const [matchToDelete, setMatchToDelete] = useState<Match | null>(null)
    const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null)

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

    return (
        <>
            <Typography variant='h3' padding={2}>
                Match List
            </Typography>

            <Box width="100%"
                display='flex'
                justifyContent='flex-end'
                m={1}
            >
                <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => setSelectingType(true)}
                >
                    New Match
                </Button>
            </Box>

            {!loading && matches ? (
                <>
                    <TableContainer component={Paper}>
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
                                {matches.map((match) => (
                                    <TableRow
                                        key={match.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {match.player1.name} v. {match.player2.name}
                                        </TableCell>
                                        <TableCell>{match.type}</TableCell>
                                        <TableCell>{match.status}</TableCell>
                                        <TableCell align="center">
                                            <Box>
                                                <Tooltip title='Resume'>
                                                    <IconButton size='small' color='primary'
                                                        onClick={() => handleLoadMatch(match)}
                                                    >
                                                        <PlayArrowRoundedIcon />
                                                    </IconButton>
                                                </Tooltip>
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
                    {matches?.length === 0 && (
                        <Typography variant='h5' p={2}>
                            No matches yet.
                        </Typography>
                    )}
                </>
            ) : (
                <Box display='flex' justifyContent='center'>
                    <CircularProgress />
                </Box>
            )
            }


            {
                selectingType && (
                    <MatchTypeSelect
                        onCancel={() => setSelectingType(false)}
                        onOk={newMatch}
                    />
                )
            }

            {matchToDelete && (
                <DeleteMatchDialog
                    match={matchToDelete}
                    onCancel={() => setMatchToDelete(null)}
                    onDelete={deleteMatch}
                />
            )}

            {deleteSuccess && (
                <Snackbar
                    open
                    autoHideDuration={5000}
                    onClose={() => setDeleteSuccess(null)}
                    message="Match deleted"
                />
            )}
        </>
    )
}
