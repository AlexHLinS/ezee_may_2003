import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { scheduleSlice } from '../stateManager/ScheduleConstructor';


export default function ScheduleConstructor () {

    const dispatch = useAppDispatch();
    const { changeSchedule } = scheduleSlice.actions;
    const dayTimes = useAppSelector(state=>state.scheduleReducer);

    const [weekday, setWeekday] = React.useState<number>(0);
    const handleWeekday = (
        __: React.MouseEvent<HTMLElement>,
        newWeekday: number | null
      ) => {
        if (newWeekday != null) {
          setWeekday(newWeekday);
        }
      };

    const handleDaytime = (
        __: React.MouseEvent<HTMLElement>,
        dayTimes: Array<string>
      ) => {
        console.log(dayTimes);
        dispatch(changeSchedule({
            weekday,
            dayTimes
        }));
      };

    console.log(dayTimes)


    return <><Box>Укажите удобное время в желаемые дни недели</Box>
    <ToggleButtonGroup
      className='toggleGroupButton'
      value={weekday}
      exclusive
      onChange={handleWeekday}
    >
      <ToggleButton value={0}>
        Пн
      </ToggleButton>
      <ToggleButton value={1}>
        Вт
      </ToggleButton>
      <ToggleButton value={2}>
        Ср
      </ToggleButton>
      <ToggleButton value={3}>
        Чт
      </ToggleButton>
      <ToggleButton value={4}>
        Пт
      </ToggleButton>
      <ToggleButton value={5}>
        Сб
      </ToggleButton>
      <ToggleButton value={6}>
        Вс
      </ToggleButton>
    </ToggleButtonGroup>
    <Box>Укажите удобное время в желаемые дни недели</Box>
    <ToggleButtonGroup
      className='toggleGroupButton'
      value={Object.keys(dayTimes[weekday]).filter(key=>dayTimes[weekday][key]==true)}
      onChange={handleDaytime}
    >
      <ToggleButton value='morning'>
        Утро
      </ToggleButton>
      <ToggleButton value='noon'>
        День
      </ToggleButton>
      <ToggleButton value='evening'>
        Вечер
      </ToggleButton>
    </ToggleButtonGroup>
    </>
}