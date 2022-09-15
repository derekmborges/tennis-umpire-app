import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MatchType } from '../lib/types';
import { useMatchManager } from '../providers/matchManager'
import { MatchTypeSelect } from './MatchTypeSelect';

export const MatchList = () => {
    const [selectingType, setSelectingType] = useState<boolean>(false);
    const { handleNewMatch } = useMatchManager()

    const newMatch = (type: MatchType) => {
        handleNewMatch(type)
    }

    return (
        <>
            <Typography variant='h3' padding={2}>
                Match List
            </Typography>
            <Button
                sx={{ mt: 4 }}
                size='large'
                variant='contained'
                color='secondary'
                onClick={() => setSelectingType(true)}
            >
                Create Match
            </Button>

            {selectingType && (
                <MatchTypeSelect
                    onCancel={() => setSelectingType(false)}
                    onOk={newMatch}
                />
            )}
        </>
    )
}
