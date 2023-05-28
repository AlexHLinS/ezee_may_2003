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
import { BookingSlice } from '../stateManager/Bookings';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function BookCard (params : { activityId : number}) {

    const dispatch = useAppDispatch();

    const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
    const { setBooking } = BookingSlice.actions;

    const selectedActivityId = useAppSelector(state=>state.SelectedActivityReducer.id);
    const activityInfo = useAppSelector(state=>state.ActivityReducer.find(item=>item.id==selectedActivityId));
    const regexp = new RegExp("[^0-9]{3} [0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}", 'g');
    const slots = activityInfo?.schedule.match(regexp);

    const weekDays = Array.from(new Set(slots?.map(item=>item.split('. ')[0])).values());
    const timeSlots = Array.from(new Set(slots?.map(item=>item.split('. ')[1])).values());

    const [weekday, setWeekday] = React.useState<string | null>(null);
    const handleWeekday = (
        __: React.MouseEvent<HTMLElement>,
        newWeekday: string | null
      ) => {
          setWeekday(newWeekday);
        };
    
      const [timeSlot, setTimeslot] = React.useState<string | null>(null);
      const handleTimeslot = (
          __: React.MouseEvent<HTMLElement>,
          timeSlot: string | null
        ) => {
            setTimeslot(timeSlot);
          };

    return <><Card className='bookCard'>
        <CardContent className='visible'>
            <Stack spacing={1.5}>
                <Box sx={{
                    fontSize : 24,
                    fontWeight : 500,
                    color : 'red'
                }}>
                {activityInfo?.title}
                </Box>
                <Box>
                    {activityInfo?.location.address}
                </Box>
                <Stack direction='row' spacing={2}>
                </Stack>
            </Stack>
        </CardContent>
    </Card>
    <Box>День недели</Box>
    <Stack direction='row'>
        <ToggleButtonGroup
        className='toggleGroupButton'
        value={weekday}
        exclusive
        onChange={handleWeekday}
        >
            {weekDays.map(weekDay=>(
                <ToggleButton value={weekDay}>
                    {weekDay}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    </Stack>
    <Box>Время записи</Box>
    <Stack direction='row'>
        <ToggleButtonGroup
        className='toggleGroupButton'
        value={timeSlot}
        exclusive
        onChange={handleTimeslot}
        >
            {timeSlots.map(timeSlot=>(
                <ToggleButton value={timeSlot}>
                    {timeSlot.slice(0, 5)}
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    </Stack>
    <Stack direction='row' justifyContent='flex-end'>
        <Button
        onClick={()=>{
            const newBooking = {...activityInfo, timeslot : weekday + ' ' + timeSlot};
            dispatch(setBooking(newBooking));
            dispatch(selectedAndPrevPageResolver(7));
        }}
        className="actionButton"
        variant="contained"
        endIcon={<ArrowForwardIcon/>}
        disabled={!weekday || !timeSlot}
        // sx={{
        //     zIndex: 6,
        //     position: 'absolute',
        //     top : 600,
        //     right : 10
        // }}
        >
            <Box>Записаться</Box>
        </Button>
    </Stack>
    </>
}