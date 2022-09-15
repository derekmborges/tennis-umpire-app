import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import { MatchType } from '../lib/types'

type Props = {
    onCancel: () => void;
    onOk: (type: MatchType) => void;
}

export const MatchTypeSelect = ({ onCancel, onOk }: Props) => {
    const [type, setType] = useState<MatchType | null>(null)

    const handleCancel = () => {
        onCancel()
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setType(e.target.value as MatchType)
    }

    const handleOk = () => {
        if (type) {
            onOk(type)
        }
    }

    return (
        <Dialog open>
            <DialogTitle>Select Match Type</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    aria-label='match-type'
                    name="type"
                    value={type}
                    onChange={handleChange}
                >
                    {Object.values(MatchType).map(t => (
                        <FormControlLabel
                            value={t}
                            key={t}
                            control={<Radio />}
                            label={t}
                        />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}
