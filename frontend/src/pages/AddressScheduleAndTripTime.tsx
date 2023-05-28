import React, { useRef, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import MaxTripTimeSelector from '../components/MaxTripTimeSelector';
import ScheduleConstructor from '../components/ScheduleConstructor';
import { scheduleSlice } from '../stateManager/ScheduleConstructor';

export default function AddressScheduleAndTripTime (props) {

  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const { userId } = useAppSelector(state=>state.UserProfileReducer);
  const [ userSettings, setUserSettings ] = useState({});
  const { createSchedule } = scheduleSlice.actions;
  const schedule = useAppSelector(state=>state.scheduleReducer);
  const { maxTripTime } = useAppSelector(state=>state.maxTripTimeReducer);

  const fetchUserSettings = async () => {
    const response = await fetch(`http://62.109.9.1:1337/users/${userId}/settings`);
    const resJSON = await response.json();

    setUserSettings(resJSON);
    createSchedule(resJSON.schedule);
  }

  console.log(userSettings);

  useEffect(()=>{
    fetchUserSettings();
  }, []);

  return <CSSTransition
      timeout={500}
      nodeRef={nodeRef}
      classNames={selectedPageIndex > prevPageIndex ? 'page-transition-forward' : 'page-transition-backward'}
      unmountOnExit
      in={pageIndex == selectedPageIndex}
      key={pageIndex}>
        <Stack ref={nodeRef} className='mainContainer' spacing={2}>
            <Stack
                position='relative'
                direction='row'
                justifyContent='center'
                alignItems='center'
            >
                <IconButton
                onClick={()=>dispatch(selectedAndPrevPageResolver(1))}
                sx={{
                    position : 'absolute',
                    left : 0
                }}>
                    <ArrowBackIcon sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Вход</Box>
            </Stack>
            <Box height='15vh'/>
            <Box className='hintLabel'>
                Заполните данные
            </Box>
            <TextField
                disabled
                // label='Адрес'
                className='inputTextField'
                value={ Object.keys(userSettings).length > 0 ? userSettings.location.address : 'Адрес'}
            />
              <MaxTripTimeSelector/>
              <ScheduleConstructor/>
            <Stack direction='row' justifyContent='flex-end'>
                <Button
                className="actionButton"
                variant="contained"
                endIcon={<ArrowForwardIcon/>}
                  onClick={async ()=>{
                    // const newUserSettings = { ...userSettings }
                    // newUserSettings.schedule = schedule;
                    // newUserSettings.travelTime = maxTripTime;
                    // console.log(newUserSettings);
                    // await fetch(`http://62.109.9.1:1337/users/${userId}/settings`, {
                    //   method : 'PUT',
                    //   body : JSON.stringify({})
                    // });
                    dispatch(selectedAndPrevPageResolver(3))
                  }
                }>
                  <Box>Вперед</Box>
                </Button>
            </Stack>
        </Stack>
        </CSSTransition>
};