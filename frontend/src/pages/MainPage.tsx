import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { selectedAndPrevPagesSlice } from '../stateManager/SelectedAndPrevPage';
import { useAppSelector, useAppDispatch } from '../stateManager/hooks';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ActivityCategories from './ActivityCategories';
import Bookings from './Bookings';
import { useNavigate } from 'react-router-dom';
import DisplayOne from './onboardingDislays/DisplayOne';
import DisplayTwo from './onboardingDislays/DisplayTwo';
import DisplayThree from './onboardingDislays/DisplayThree';
import { displayNumberSlice } from '../stateManager/displayOnboardingNumber';
import { mainTabSlice } from '../stateManager/mainTab';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const onboardingDisplays = [
    DisplayOne,
    DisplayTwo,
    DisplayThree
];

export default function MainPage (props) {

  const displayNumber = useAppSelector(state=>state.DisplayNUmberReducer);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(prev=>{
        if (prev == null) return event.currentTarget;
        else return null;
    });
  };
  const open = Boolean(anchorEl);

  const nodeRef = useRef(null);
  const dispatch = useAppDispatch();
  const { selectedAndPrevPageResolver } = selectedAndPrevPagesSlice.actions;
  const navigate = useNavigate();
  const { setDisplayNumber } = displayNumberSlice.actions;
  const { setMainTab } = mainTabSlice.actions;

  const tab = useAppSelector(state=>state.MainTabReducer);

  const handleTab = (
      __: React.MouseEvent<HTMLElement>,
      newTab: 'booking' | 'activityCategories' | null
    ) => {
      if (newTab != null) {
        dispatch(setMainTab(newTab));
      }
    };

  return <>
        <Stack ref={nodeRef} className='mainContainer' spacing={2}>
        <TransitionGroup
            component={null}
            appear
        >
            {onboardingDisplays.filter((_, index)=>index==displayNumber).map(Item=>
                <CSSTransition
                timeout={500}
                classNames='onboardingDisplay'
                key={displayNumber}
                unmountOnExit
                >
                    <Item/>
                </CSSTransition>
            )}
        </TransitionGroup>
            <Stack
                position='relative'
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <IconButton
                onClick={()=>{
                    dispatch(selectedAndPrevPageResolver(1));
                    setTimeout(()=>navigate('/inputfirst'), 0);
                }}>
                    <LogoutIcon sx={{
                        color : 'black',
                        transform : 'rotate(180deg)'
                    }}/>
                </IconButton>
                <Box className='mainLabel'>Главная</Box>
                <IconButton onClick={handleClick}>
                    <MenuIcon sx={{
                        color : 'black'
                    }} />
                </IconButton>
            </Stack>
            <Button className='startChat'
            sx={{
                zIndex : displayNumber == 0 ? 1 : 0
            }}
            onClick={()=>{
                if (displayNumber == 0) {
                    dispatch(setDisplayNumber(1));
                }
                else {
                    dispatch(selectedAndPrevPageResolver(8));
                    setTimeout(()=>navigate('/questionone'), 0);
                }
            }}>
                <Stack width='100%' direction='column' alignItems='start'>
                    <Box>Подобрать занятие</Box>
                    <Box sx={{
                        fontSize : 16,
                        fontWeight : 400}}>Интересное сегодня</Box>
                </Stack>
            </Button>
            <ToggleButtonGroup
                className='toggleGroupButton'
                value={tab}
                exclusive
                onChange={handleTab}
                >
                <ToggleButton
                sx={{
                    backgroundColor : 'white',
                    zIndex : displayNumber == 1 ? 1 : 0
                }}
                className='activityCategoriesBookingsTab'
                value={'activityCategories'}
                onClick={
                    (e)=>{
                        if (displayNumber == 1) {
                            e.preventDefault();
                            dispatch(setDisplayNumber(2));
                        }
                    }
                }>
                    <Stack
                    width='100%'
                    spacing={2}
                    direction='column'
                    justifyContent='start'
                    alignItems='start'>
                        <Stack direction='column' alignItems='start'>
                            <Box sx={{
                                fontSize : 24,
                                fontWeight: 700
                            }}>Вам</Box>
                            <Box sx={{
                                fontSize : 24,
                                fontWeight: 700
                            }}>подойдут</Box>
                        </Stack>
                        <Box sx={{
                                fontSize : 16,
                                fontWeight: 400
                            }}>находятся рядом</Box>
                    </Stack>
                </ToggleButton>
                <ToggleButton
                    className='activityCategoriesBookingsTab'
                    value={'bookings'}
                    sx={{
                        backgroundColor : 'white',
                        zIndex : displayNumber == 2 ? 1 : 0
                    }}
                    onClick={
                        (e)=>{
                            if (displayNumber == 2) {
                                e.preventDefault();
                                dispatch(setDisplayNumber(3));
                            }
                        }
                    }
                >
                    <Stack width='100%' spacing={2} direction='column' justifyContent='start' alignItems='start'>
                        <Stack direction='column' alignItems='start'>
                            <Box sx={{
                                fontSize : 24,
                                fontWeight: 700
                            }}>Ваши</Box>
                            <Box sx={{
                                fontSize : 24,
                                fontWeight: 700
                            }}>записи</Box>
                        </Stack>
                        <Box sx={{
                                fontSize : 16,
                                fontWeight: 400,
                            }}>занятия</Box>
                    </Stack>
                </ToggleButton>
            </ToggleButtonGroup>
            <Menu
                anchorEl={anchorEl}
                open={open}
            >
                <MenuItem onClick={()=>{
                    handleClose();
                    dispatch(selectedAndPrevPageResolver(11));
                    setTimeout(()=>navigate('/adminmain'), 0);
                }}>Админка</MenuItem>
                <MenuItem onClick={()=>{
                    handleClose();
                    dispatch(selectedAndPrevPageResolver(2));
                    setTimeout(()=>navigate('/inputsecond'), 0);
                }}>Настройки профиля</MenuItem>
            </Menu>
            <Stack spacing={2}>
            {tab == 'activityCategories' ? <ActivityCategories/> : null}
            {tab == 'bookings' ? <Bookings/> : null}
            </Stack>
            {/* {activityCategoriesId.map(id=>{
                return <ActivityCategoryCard activityCategoryId={id}/>
            })}
            <Box>Можно попробовать</Box>
            {activityCategoriesId.map(id=>{
                return <ActivityCategoryCard activityCategoryId={id}/>
            })} */}
        </Stack></>
};