import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import { IMaskInput } from 'react-imask';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { CSSTransition } from 'react-transition-group';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { UserProfileSlice } from '../stateManager/UserProfile';

  interface demoUser {
    "id": number,
    "label" : string,
    "year" : string
  }
  
export default function SurNameAndBirthDateInput (props) {
  
  const nodeRef = useRef(null);
  const { pageIndex } = props;
  const {selectedPageIndex, prevPageIndex} = useAppSelector(state=>state.selectedAndPrevPageReducer);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const [demoUsers, setDemoUsers] = useState<demoUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<demoUser>({});

  const { setUserProfile } = UserProfileSlice.actions;
  
  const fetchDemoUsers = async () => {
    let response = await fetch('http://62.109.9.1:1337/users/demo', {
      mode : 'cors'
    });
    let resJSON = await response.json();

    console.log(resJSON);
  
    setDemoUsers(resJSON.map(item=>({
      id : item.id,
      label : item.name + ' ' + item.surname + ' ' + (item.coldStart ? '(новый)' : '(известный)'),
      year : item.birthdate
    })));
  }

  useEffect(()=>{
    fetchDemoUsers();
  }, [])


  console.log(selectedPageIndex, prevPageIndex, pageIndex);

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
                onClick={()=>dispatch(selectedAndPrevPageResolver(0))}
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
                Выберете персонажа
            </Box>
            <Autocomplete
            onChange={(__, newOption)=>{
              if (newOption == null) setSelectedUser({});
              else setSelectedUser(newOption);
            }}
            disablePortal
            options={demoUsers}
            renderInput={(params)=><TextField {...params} label="ФИО" className='inputTextField'/>}
            />
            <TextField
                disabled
                className='inputTextField'
                value={Object.keys(selectedUser).length ?  selectedUser.year : 'Дата рождения'}
            />
            <Stack direction='row' justifyContent='flex-end'>
                <Button
                disabled={Object.keys(selectedUser).length == 0}
                onClick={()=>{
                  dispatch(setUserProfile(selectedUser.id))
                  dispatch(selectedAndPrevPageResolver(2))
                }}
                className="actionButton"
                variant="contained"
                endIcon={<ArrowForwardIcon/>}>
                  <Box>Вперед</Box>
                </Button>
            </Stack>
        </Stack>
        </CSSTransition>
};