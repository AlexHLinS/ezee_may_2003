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

export default function ActivityCard (params : { activityId : number}) {

    const { activityId } = params;

    const dispatch = useAppDispatch();
    const activityInfo = useAppSelector(state=>state.ActivityReducer.find(item=>item.id==activityId));
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { setSelectedActivity } = SelectedActivitySlice.actions;
    const regexp = new RegExp("[^0-9]{3} [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}", 'g');
    const slots = activityInfo?.schedule.match(regexp);

    return <Card className='activityCard'>
        <CardContent className='visible'>
            <Stack spacing={1}>
                <Stack direction='row' justifyContent='space-between' alignItems='start'>
                    <Box sx={{width : 100}}>{activityInfo?.title}</Box>
                    <Stack sx={{fontSize : 14, fontWeight : 400}} direction='row' spacing={1} alignItems='center'>
                        { activityInfo?.location.isNear ? <Box className="nearActivity">{"в двух шагах"}</Box> : null}
                        <Box className="distanceToActivity">{activityInfo?.location.distance}</Box>
                    </Stack>
                </Stack>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack direction='column'>
                        {slots?.map((slot, index)=>(
                            <Box key={index}>{slot}</Box>
                        ))}
                    </Stack>
                    <Stack direction='row' spacing={1} sx={{fontSize : 12}} alignItems='start'>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={carLogo}/>
                            <Box>{activityInfo?.location.estimatedTime * 0.6} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={busLogo}/>
                            <Box>{activityInfo?.location.estimatedTime} мин</Box>
                        </Stack>
                        <Stack direction='row'spacing={0.5} alignItems='center'>
                            <img src={personLogo}/>
                            <Box>{activityInfo?.location.estimatedTime * 1.3} мин</Box>
                        </Stack>
                    </Stack>
                </Stack>
                <Box>{activityInfo?.location.address}</Box>
                <Stack direction='row' spacing={2}>
                </Stack>
                <Stack justifyContent='flex-end' direction='row'>
                    <Button
                    className='bookButton'
                    onClick={
                        ()=>{
                            dispatch(setSelectedActivity(activityId));
                            dispatch(selectedAndPrevPageResolver(6));
                        }
                    }
                    >Записаться</Button>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
}