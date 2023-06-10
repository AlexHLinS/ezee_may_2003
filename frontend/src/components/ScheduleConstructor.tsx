import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { scheduleSlice } from '../stateManager/ScheduleConstructor';
import { Stack } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';


export default function ScheduleConstructor () {

    const dispatch = useAppDispatch();
    const { changeSchedule } = scheduleSlice.actions;
    const dayTimes = useAppSelector(state=>state.scheduleReducer);

    console.log(dayTimes);

    const [weekday, setWeekday] = React.useState<number>(0);
    // const handleWeekday = (
    //     __: React.MouseEvent<HTMLElement>,
    //     newWeekday: number | null
    //   ) => {
    //     if (newWeekday != null) {
    //       setWeekday(newWeekday);
    //     }
    //   };

    // const handleDaytime = (
    //     __: React.MouseEvent<HTMLElement>,
    //     dayTimes: Array<string>
    //   ) => {
    //     dispatch(changeSchedule({
    //         weekday,
    //         dayTimes
    //     }));
    //   };

    return <><Box sx={{
      fontWeight : 600,
      fontSize : 16
    }}
    >Выберете удобное время для занятий</Box>
    {dayTimes.length &&
    <Stack direction='column'
    alignItems='center'
    spacing={-0.5}>
      <Stack direction='row'
        justifyContent='space-around'
        alignItems='center'
        spacing={6}>
          <Box></Box>
          <Box>Утро</Box>
          <Box>День</Box>
          <Box>Вечер</Box>
        </Stack>
      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((item, index)=>
        <Stack
          direction='row'
          alignItems='center'
          spacing={4}
          ><Box>{item}</Box>
          {['morning', 'noon', 'evening'].map(item=>(
            <Checkbox checked={dayTimes[index][item]}
            onChange={()=>{
              dispatch(changeSchedule({
                weekday : index,
                dayTime : item
              }));
            }}
            size='large'
            sx={{
              color : 'black',
            }}
          />))}
        </Stack>)
        }
    </Stack>
    }
    </>
}