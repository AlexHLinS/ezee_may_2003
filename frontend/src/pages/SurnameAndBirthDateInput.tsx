import React, { useRef, useEffect } from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAppSelector,
    useAppDispatch
  } from '../stateManager/hooks';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { selectedCharacterSlice, selectedСharacterInterface } from '../stateManager/SelectedСharacter';
import { UserProfileSlice } from '../stateManager/UserProfile';
import { useNavigate } from 'react-router-dom';
import { displayNumberSlice } from '../stateManager/displayOnboardingNumber';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

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
  const { selectedCharacterResolver } = selectedCharacterSlice.actions;
  const selectedCharacter = useAppSelector(state=>state.SelectedCharacterReducer);
  const { setDisplayNumber } = displayNumberSlice.actions;


  const [demoUsers, setDemoUsers] = useState<selectedСharacterInterface[]>([]);
  const navigate = useNavigate();

  const fetchDemoUsers = async () => {
    let response = await fetch('https://alexhlins1.fvds.ru:1338/users/demo', {
      mode : 'cors'
    });
    let resJSON = await response.json();

    console.log(resJSON);

    setDemoUsers(resJSON.map(item=>({
      id : item.id,
      label : item.name + ' ' + item.surname + ' ' + (item.coldStart ? '(новый)' : '(известный)') + ' ' + item.id,
      year : item.birthdate,
      age : item.age,
      gender : item.gender
    })));
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('clicked')
    setAnchorEl(prev=>{
        if (prev == null) return event.currentTarget;
        else return null;
    });
  };
  const open = Boolean(anchorEl);

  useEffect(()=>{
    fetchDemoUsers();
  }, [])

  return <Stack
          ref={nodeRef}
          className='mainContainer'
          height='100%'
          spacing={3}>
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <IconButton
                onClick={()=>
                  {
                    dispatch(selectedAndPrevPageResolver(0));
                    setTimeout(()=>navigate('/'), 0);
                  }
                }>
                    <ArrowBackIcon
                    fontSize='large'
                    sx={{
                        color : 'black'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Вход</Box>
                <IconButton onClick={handleClick}>
                    <MenuIcon
                    fontSize='large'
                    sx={{
                        color : 'black'
                    }} />
                </IconButton>
            </Stack>
            <Box height='2vh'/>
            <Box className='hintLabel'>
                Выберете персонажа
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                // MenuListProps={{
                // 'aria-labelledby': 'basic-button',
                // }}
            >
                <MenuItem onClick={()=>{
                    handleClose();
                    dispatch(selectedAndPrevPageResolver(11));
                    setTimeout(()=>navigate('/adminmain'), 0);
                }}>Админка</MenuItem>
            </Menu>
            <Autocomplete
            value={Object.keys(selectedCharacter).length ? selectedCharacter : null}
            onChange={(__, newOption)=>{
              if (newOption == null) dispatch(selectedCharacterResolver({}));
              else dispatch(selectedCharacterResolver(newOption));
            }}
            disablePortal
            options={demoUsers}
            renderInput={(params)=><TextField {...params} label="ФИО" className='inputTextField'/>}
            />
            <TextField
                disabled
                className='inputTextField'
                value={selectedCharacter ?  selectedCharacter.year : 'Дата рождения'}
            />
            <Stack
            direction='row'
            justifyContent='flex-end'
            height='100%'
            flexWrap='wrap'
            alignContent='flex-end'>
                <Button
                disabled={Object.keys(selectedCharacter).length == 0}
                onClick={()=>{
                  console.log(selectedCharacter);
                  if (selectedCharacter.label?.includes('(новый)')) {
                    dispatch(setDisplayNumber(0));
                    dispatch(selectedAndPrevPageResolver(2));
                    setTimeout(()=>navigate('/inputsecond'), 0);
                  }
                  else {
                    dispatch(setDisplayNumber(3));
                    dispatch(selectedAndPrevPageResolver(3));
                    setTimeout(()=>navigate('/main'), 0);
                  }
                }}
                className="actionButton"
                variant="contained"
                endIcon={<ArrowForwardIcon/>}>
                  <Box>Вперед</Box>
                </Button>
            </Stack>
        </Stack>
};