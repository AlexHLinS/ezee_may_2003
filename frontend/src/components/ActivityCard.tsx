import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActions, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import busLogo from '../pages/svg/busIcon.svg';
import personLogo from '../pages/svg/personIcon.svg';
import carLogo from '../pages/svg/carIcon.svg';
import { SelectedActivitySlice } from '../stateManager/SelectedActivity';
import { useNavigate } from 'react-router-dom';

export default function ActivityCard (params : { activityId : number, index : number}) {

    const { activityId, index } = params;

    const dispatch = useAppDispatch();
    const activityInfo = useAppSelector(state=>state.ActivityReducer.find(item=>item.id==activityId));
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { setSelectedActivity } = SelectedActivitySlice.actions;
    const regexp = new RegExp("[^0-9]{3} [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}", 'g');
    const slots = activityInfo?.schedule.match(regexp);
    const navigation = useNavigate();

    return <Card className='activityCard' sx={{
        transitionDelay : `${200 * index}ms !important`
    }}>
        <CardContent className='visible'>
            <Stack spacing={2}>
                <Stack direction='row' justifyContent='space-between' alignItems='start'>
                    <Box sx={{width : 100, fontWeight : 700, fontSize : 20}}>{activityInfo?.title}</Box>
                    <Stack sx={{fontSize : 14, fontWeight : 400}} direction='column' spacing={1} alignItems='end'>
                        { activityInfo?.location.isNear ? <Box className="nearActivity">{"в двух шагах"}</Box> : null}
                        <Box className="distanceToActivity">{activityInfo?.location.distance} м</Box>
                        <Box className="distanceToActivity">id: {activityInfo?.id}</Box>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack sx={{fontSize : 16, fontWeight : 600}} direction='column'>
                        {slots?.map((slot, index)=>(
                            <Box key={index}>{slot}</Box>
                        ))}
                    </Stack>
                    <Stack direction='row' spacing={1} sx={{fontSize : 16}} alignItems='start'>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={carLogo}/>
                            <Box>{Math.floor(activityInfo?.location.estimatedTime * 0.6)} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={busLogo}/>
                            <Box>{activityInfo?.location.estimatedTime} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={personLogo}/>
                            <Box>{Math.floor(activityInfo?.location.estimatedTime * 1.3)} мин</Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Box sx={{fontSize : 16}}>{activityInfo?.location.address}</Box>
                <Stack direction='row' spacing={2}>
                </Stack>
                <Stack justifyContent='flex-end' direction='row'>
                    <Button
                    className='bookButton'
                    onClick={
                        ()=>{
                            // const newBooking = {...activityInfo, timeslot : weekday + ' ' + timeSlot};
                            // dispatch(setBooking(newBooking));
                            dispatch(setSelectedActivity(activityId));
                            dispatch(selectedAndPrevPageResolver(6));
                            setTimeout(()=>navigation('/book'), 0)
                        }
                    }
                    >Записаться</Button>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
}