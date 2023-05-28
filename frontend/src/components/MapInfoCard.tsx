import React from 'react';
import { Box, Button, Stack } from "@mui/material";
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import busLogo from '../pages/svg/busIcon.svg';
import personLogo from '../pages/svg/personIcon.svg';
import carLogo from '../pages/svg/carIcon.svg';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { SelectedActivitySlice } from '../stateManager/SelectedActivity';

export default function MapInfoCard (props : {id : number}) {

    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { setSelectedActivity } = SelectedActivitySlice.actions;

    const { id } = props;
    const activitiyInfo = useAppSelector(state=>state.ActivityReducer.find(item=>item.id==id))
    const regexp = new RegExp("[^0-9]{3} [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}", 'g');
    const slots = activitiyInfo?.schedule.match(regexp);

    return <Stack spacing={1} sx={{backgroundColor : 'white'}} direction='column'>
        <Box>{activitiyInfo?.title}</Box>
        <Stack direction='row' spacing={5}>
            { activitiyInfo?.location.isNear ? <Box className="nearActivity">{"в двух шагах"}</Box> : null}
            <Box className="distanceToActivity">{activitiyInfo?.location.distance}</Box>
        </Stack>
        <Stack direction='row' spacing={2}>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={carLogo}/>
                <Box>{activitiyInfo?.location.estimatedTime * 0.6} мин</Box>
            </Stack>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={busLogo}/>
                <Box>{activitiyInfo?.location.estimatedTime} мин</Box>
            </Stack>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={personLogo}/>
                <Box>{activitiyInfo?.location.estimatedTime * 1.3} мин</Box>
            </Stack>
        </Stack>
        <Stack direction='column'>
            {slots?.map((slot, index)=>(
                <Box key={index}>{slot}</Box>
            ))}
        </Stack>
        <Box>{activitiyInfo?.location.address}</Box>
        <Stack width={200} justifyContent='flex-end' direction='row'>
            <Button
            className='bookButton'
            onClick={
                ()=>{
                    dispatch(setSelectedActivity(id));
                    dispatch(selectedAndPrevPageResolver(6));
                }
            }
            >Записаться</Button>
        </Stack>
    </Stack>
}