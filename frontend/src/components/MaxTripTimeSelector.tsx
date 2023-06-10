import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import { maxTripTimeSlice } from '../stateManager/MaxTripTime';


export default function MaxTripTimeSelector () {

    const dispatch = useAppDispatch();
    const { maxTripTimeChange } = maxTripTimeSlice.actions;
    const { maxTripTime } = useAppSelector(state=>state.maxTripTimeReducer);

    const handleNewMaxTripTime = (
        __ : React.MouseEvent<HTMLElement>,
        newValue : number | null
    ) => {
        if (newValue != null) dispatch(maxTripTimeChange(newValue));
    }

    return <><Box sx={{
            fontWeight : 600,
            fontSize : 16
            }}>Допустимое время на дорогу</Box>
            <ToggleButtonGroup
            className='toggleGroupButton'
            value={maxTripTime}
            exclusive
            onChange={handleNewMaxTripTime}
            aria-label="text alignment"
            >
            <ToggleButton value={30} aria-label="left aligned">
                30 мин
            </ToggleButton>
            <ToggleButton value={60} aria-label="centered">
                1 час
            </ToggleButton>
            <ToggleButton value={90} aria-label="right aligned">
                {"< 1.5 часов"}
            </ToggleButton>
            </ToggleButtonGroup></>
}