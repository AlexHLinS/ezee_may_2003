import React from 'react';
import { Box, Button, Stack } from "@mui/material";
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import busLogo from '../pages/svg/busIcon.svg';
import personLogo from '../pages/svg/personIcon.svg';
import carLogo from '../pages/svg/carIcon.svg';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { SelectedActivitySlice } from '../stateManager/SelectedActivity';
import { useNavigate } from 'react-router-dom';

export default function MapInfoCard (props : {id : number}) {

    const dispatch = useAppDispatch();
    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { setSelectedActivity } = SelectedActivitySlice.actions;
    const navigation = useNavigate();

    const { id } = props;
    const activitiyInfo = useAppSelector(state=>state.ActivityReducer.find(item=>item.id==id))
    const regexp = new RegExp("[^0-9]{3} [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}", 'g');
    const slots = activitiyInfo?.schedule.match(regexp);

    return <Stack spacing={2}
        sx={{
        backgroundColor : 'white',
        fontSize : 16
        }} direction='column'>
        <Box>{activitiyInfo?.title}</Box>
        <Stack direction='row' spacing={5}>
            { activitiyInfo?.location.isNear ? <Box className="nearActivity">{"в двух шагах"}</Box> : null}
            <Box className="distanceToActivity">{activitiyInfo?.location.distance} м</Box>
        </Stack>
        <Stack direction='row' spacing={2}>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={carLogo}/>
                <Box>{Math.floor(activitiyInfo?.location.estimatedTime)} мин</Box>
            </Stack>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={busLogo}/>
                <Box>{Math.floor(activitiyInfo?.location.estimatedTime * 1.5)} мин</Box>
            </Stack>
            <Stack direction='row'spacing={0.5} alignItems='center'>
                <img src={personLogo}/>
                <Box>{Math.floor(activitiyInfo?.location.estimatedTime * 2)} мин</Box>
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
                    setTimeout(()=>navigation('/book'), 0);
                }
            }
            >Записаться</Button>
        </Stack>
    </Stack>
}