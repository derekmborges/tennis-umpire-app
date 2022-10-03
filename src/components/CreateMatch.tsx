import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik'
import { useMatchManager } from '../providers/matchManager';
import * as Yup from 'yup';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { Player } from '../lib/types';

const playerSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Player name must be at least 2 characters')
        .required('Player name required'),
    countryAbbrev: Yup.string()
        .length(3, 'Must be 3-Letter country code')
        .required('Country required'),
    countryFlag: Yup.string().required(),
    rank: Yup
        .number()
        .positive('Rank must be > 0')
        .max(100, 'Rank is only for top 100 players')
        .optional()
})

const schema = Yup.object().shape({
    player1: playerSchema,
    player2: playerSchema
})

type CountryOption = {
    label: string,
    flag: string,
    abbrev: string
}

export const CreateMatch = () => {
    const { matchType, handleInitMatch, handleCloseMatch } = useMatchManager()

    const [countries, setCountries] = useState<CountryOption[] | null>(null)
    const getCountries = async () => {
        const response = await axios.get('https://restcountries.com/v3.1/all')
        const countries: CountryOption[] = response.data.map((country: any) => ({
            label: `${country.flag} ${country.name.common}`,
            abbrev: country.cca3,
            flag: country.flag
        }))
        setCountries(countries)
    }
    useEffect(() => {
        getCountries()
    }, [])

    const formik = useFormik({
        validationSchema: schema,
        initialValues: {
            player1: {
                name: '',
                countryAbbrev: '',
                countryFlag: '',
                rank: ''
            },
            player2: {
                name: '',
                countryAbbrev: '',
                countryFlag: '',
                rank: ''
            }
        },
        onSubmit: values => {
            const player1: Player = {
                name: values.player1.name,
                countryAbbrev: values.player1.countryAbbrev,
                countryFlag: values.player1.countryFlag
            }
            if (values.player1.rank.length > 0) {
                player1.rank = Number.parseInt(values.player1.rank)
            }
            const player2: Player = {
                name: values.player2.name,
                countryAbbrev: values.player2.countryAbbrev,
                countryFlag: values.player2.countryFlag
            }
            if (values.player2.rank.length > 0) {
                player2.rank = Number.parseInt(values.player2.rank)
            }
            handleInitMatch(player1, player2)
        }
    })

    return (
        <Box sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Typography variant='h4'>
                {matchType} Match Details
            </Typography>
            {countries ? (
                <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: '100%' }}
                >
                    <Stack
                        width='100%'
                        direction={{ xs: 'column', sm: 'row' }}
                        display='flex'
                        justifyContent='space-around'
                        alignItems='center'
                    >

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 2
                        }}>
                            <Typography variant='h6'>
                                Player 1
                            </Typography>
                            <TextField
                                id="player1-name"
                                name="player1.name"
                                label="Name"
                                variant='filled'
                                value={formik.values.player1.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.player1?.name && Boolean(formik.errors.player1?.name)}
                                helperText={formik.touched.player1?.name && formik.errors.player1?.name}
                                sx={{ mt: 2 }}
                            />
                            <Autocomplete
                                disablePortal
                                id="player1-country"
                                options={countries}
                                getOptionLabel={option => option.label}
                                onChange={(_, value) => {
                                    formik.setFieldValue(
                                        "player1.countryAbbrev",
                                        value?.abbrev || ''
                                    )
                                    formik.setFieldValue(
                                        "player1.countryFlag",
                                        value?.flag || ''
                                    )
                                }}
                                renderInput={(params) => <TextField
                                    {...params}
                                    name="player1.country"
                                    label="Country"
                                    variant='filled'
                                    error={formik.touched.player1?.countryAbbrev && Boolean(formik.errors.player1?.countryAbbrev)}
                                    helperText={formik.touched.player1?.countryAbbrev && formik.errors.player1?.countryAbbrev}
                                    sx={{ mt: 2 }}
                                />}
                            />
                            <TextField
                                id="player1-rank"
                                name="player1.rank"
                                label="Rank (if in Top 100)"
                                variant='filled'
                                placeholder=''
                                value={formik.values.player1.rank}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.player1?.rank && Boolean(formik.errors.player1?.rank)}
                                helperText={formik.touched.player1?.rank && formik.errors.player1?.rank}
                                sx={{ mt: 2 }}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            mt: 2
                        }}>
                            <Typography variant='h6'>
                                Player 2
                            </Typography>
                            <TextField
                                id="player2-name"
                                name="player2.name"
                                label="Name"
                                variant='filled'
                                value={formik.values.player2.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.player2?.name && Boolean(formik.errors.player2?.name)}
                                helperText={formik.touched.player2?.name && formik.errors.player2?.name}
                                sx={{ mt: 2 }}
                            />
                            <Autocomplete
                                disablePortal
                                id="player2-country"
                                options={countries}
                                getOptionLabel={option => option.label}
                                onChange={(_, value) => {
                                    formik.setFieldValue(
                                        "player2.countryAbbrev",
                                        value?.abbrev || ''
                                    )
                                    formik.setFieldValue(
                                        "player2.countryFlag",
                                        value?.flag || ''
                                    )
                                }}
                                renderInput={(params) => <TextField
                                    {...params}
                                    name="player2.country"
                                    label="Country"
                                    variant='filled'
                                    error={formik.touched.player2?.countryAbbrev && Boolean(formik.errors.player2?.countryAbbrev)}
                                    helperText={formik.touched.player2?.countryAbbrev && formik.errors.player2?.countryAbbrev}
                                    sx={{ mt: 2 }}
                                />}
                            />
                            <TextField
                                id="player2-rank"
                                name="player2.rank"
                                label="Rank (if in Top 100)"
                                variant='filled'
                                value={formik.values.player2.rank}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.player2?.rank && Boolean(formik.errors.player2?.rank)}
                                helperText={formik.touched.player2?.rank && formik.errors.player2?.rank}
                                sx={{ mt: 2 }}
                            />
                        </Box>

                    </Stack>

                    <Box sx={{
                        width: '100%',
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <LoadingButton
                            type="submit"
                            variant='contained'
                            size='large'
                            color='info'
                            loading={formik.isSubmitting}
                            sx={{ mt: 2, width: 200 }}
                        >
                            Create
                        </LoadingButton>
                        <Button
                            variant='outlined'
                            size='large'
                            color='info'
                            sx={{ mt: 2, width: 200 }}
                            onClick={handleCloseMatch}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            ) : (
                <CircularProgress />
            )}

        </Box>
    )
}
