import { AppBar, Avatar, Box, Container, Fab, IconButton, Menu, MenuItem, styled, Toolbar, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { MatchStatus } from '../lib/models/match'
import { useMatchManager } from '../providers/matchManager'
import { CreateMatch } from './CreateMatch'
import { MatchList } from './MatchList/MatchList'
import { MatchManager } from './MatchManager/MatchManager'
import { MatchResult } from './MatchResult'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useAuth } from '../providers/authProvider'

export const ManagerApp = () => {
    const { user, handleLogout } = useAuth()
    const { matchStatus, handleCloseMatch } = useMatchManager()
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const statusMap = new Map<MatchStatus | null, JSX.Element>([
        [null, <MatchList />],
        [MatchStatus.CREATING, <CreateMatch />],
        [MatchStatus.PENDING_START, <MatchManager />],
        [MatchStatus.IN_PROGRESS, <MatchManager />],
        [MatchStatus.COMPLETE, <MatchResult />]
    ])

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        handleCloseUserMenu()
        handleLogout()
    }

    const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Match Manager
                        </Typography>
                        <Typography mr={2}>
                            {user?.displayName}
                        </Typography>
                        <Tooltip title="Open settings">
                            <IconButton
                                sx={{ p: 0 }}
                                onClick={handleOpenUserMenu}
                            >
                                <Avatar alt={user?.displayName || ''}>
                                    <img src={user?.photoUrl || ''} alt='profile pic' referrerPolicy='no-referrer' />
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Offset />
            </Box>

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

            {matchStatus && matchStatus > MatchStatus.CREATING && (
                <Fab
                    size='small'
                    sx={{
                        position: 'absolute',
                        top: 75,
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
