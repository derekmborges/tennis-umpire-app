import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
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
    country: Yup.string()
        .length(3, 'Must be 3-Letter country code')
        .required('Country required'),
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
    value: string
}

export const CreateMatch = () => {
    const { matchType, handleInitMatch } = useMatchManager()

    const [countries, setCountries] = useState<CountryOption[] | null>(null)
    const getCountries = async () => {
        const response = await axios.get('https://restcountries.com/v3.1/all')
        const countries: CountryOption[] = response.data.map((country: any) => ({
            label: `${country.flag} ${country.name.common}`,
            value: country.cca3
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
                country: '',
                rank: ''
            },
            player2: {
                name: '',
                country: '',
                rank: ''
            }
        },
        onSubmit: values => {
            console.log('match details:', values);
            
            const player1: Player = {
                name: values.player1.name,
                country: values.player1.country,
            }
            if (values.player1.rank.length > 0) {
                player1.rank = Number.parseInt(values.player1.rank)
            }
            const player2: Player = {
                name: values.player2.name,
                country: values.player2.country,
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
                    <Box sx={{
                        mt: 2,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
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
                                        "player1.country",
                                        value?.value || ''
                                    )
                                }}
                                renderInput={(params) => <TextField
                                    {...params}
                                    name="player1.country"
                                    label="Country"
                                    variant='filled'
                                    error={formik.touched.player1?.country && Boolean(formik.errors.player1?.country)}
                                    helperText={formik.touched.player1?.country && formik.errors.player1?.country}
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
                            flexDirection: 'column'
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
                                        "player2.country",
                                        value?.value || ''
                                    )
                                }}
                                renderInput={(params) => <TextField
                                    {...params}
                                    name="player2.country"
                                    label="Country"
                                    variant='filled'
                                    error={formik.touched.player2?.country && Boolean(formik.errors.player2?.country)}
                                    helperText={formik.touched.player2?.country && formik.errors.player2?.country}
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

                    </Box>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <LoadingButton
                            type="submit"
                            variant='contained'
                            size='large'
                            color='info'
                            // loading={formik.isSubmitting}
                            sx={{ m: 4, width: 200 }}
                        >
                            Create
                        </LoadingButton>
                    </Box>
                </form>
            ) : (
                <CircularProgress />
            )}

        </Box>
    )
}
