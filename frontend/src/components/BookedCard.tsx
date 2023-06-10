import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import busLogo from '../pages/svg/busIcon.svg';
import personLogo from '../pages/svg/personIcon.svg';
import carLogo from '../pages/svg/carIcon.svg';
import { Booking } from '../stateManager/Bookings';

export default function BookedCard (params : {activityInfo : Booking}) {

    const { activityInfo } = params;

    return <Card className='activityCard'>
        <CardContent className='visible'>
            <Stack spacing={1.5}>
                <Stack direction='row' justifyContent='space-between' alignItems='start'>
                    <Box sx={{width : 100, fontWeight : 900}}>{activityInfo?.title}</Box>
                    <Stack sx={{fontSize : 14, fontWeight : 400}} direction='row' spacing={1} alignItems='center'>
                        { activityInfo?.location.isNear ? <Box className="nearActivity">{"в двух шагах"}</Box> : null}
                        <Box className="distanceToActivity">{activityInfo?.location.distance} м</Box>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='column'>
                        <Box>{activityInfo.timeslot}</Box>
                    </Stack>
                    <Stack direction='row' spacing={1} sx={{fontSize : 12}} alignItems='start'>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={carLogo}/>
                            <Box>{Math.floor(activityInfo?.location.estimatedTime * 0.6)} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={busLogo}/>
                            <Box>{Math.floor(activityInfo?.location.estimatedTime)} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={personLogo}/>
                            <Box>{Math.floor(activityInfo?.location.estimatedTime * 1.3)} мин</Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Box>{activityInfo?.location.address}</Box>
                <Stack direction='row' spacing={2}>
                </Stack>
                <Stack justifyContent='flex-end' direction='row'>
                    <Button
                    className='bookButton'
                    disabled
                    >Отменить</Button>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
}